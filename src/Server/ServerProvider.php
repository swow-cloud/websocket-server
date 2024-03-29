<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Server;

use Carbon\Carbon;
use FastRoute\Dispatcher;
use Hyperf\Context\Context;
use Hyperf\Engine\Channel;
use Hyperf\Utils\Coroutine as SwowCoroutine;
use InvalidArgumentException;
use Psr\Http\Message\RequestInterface;
use Ramsey\Uuid\Uuid;
use Swow\CoroutineException;
use Swow\Errno;
use Swow\Http\ResponseException as HttpException;
use Swow\Http\Server;
use Swow\Http\Server\Connection;
use Swow\Http\Server\Request as SwowRequest;
use Swow\Http\Status;
use Swow\SocketException;
use Swow\WebSocket\Frame;
use Swow\WebSocket\Opcode;
use SwowCloud\Contract\LoggerInterface;
use SwowCloud\Contract\StdoutLoggerInterface;
use SwowCloud\RedisLock\RedisLock;
use SwowCloud\RedisSubscriber\Subscriber;
use SwowCloud\WebSocket\FdCollector;
use SwowCloud\WebSocket\Handler\HandlerInterface;
use SwowCloud\WebSocket\Middleware\Dispatcher as WsDispatcher;
use SwowCloud\WebSocket\Middleware\MiddlewareInterface;
use SwowCloud\WsServer\Kernel\Http\Request;
use SwowCloud\WsServer\Kernel\Http\Response;
use SwowCloud\WsServer\Kernel\Logger\AppendRequestIdProcessor;
use SwowCloud\WsServer\Kernel\Provider\AbstractProvider;
use SwowCloud\WsServer\Kernel\Router\RouteCollector;
use SwowCloud\WsServer\Kernel\Swow\ServerFactory;
use SwowCloud\WsServer\Kernel\Token\Jws;
use SwowCloud\WsServer\Logger\LoggerFactory;
use Throwable;
use function Chevere\Xr\throwableHandler;
use function FastRoute\simpleDispatcher;

/**
 * Class ServerProvider
 */
class ServerProvider extends AbstractProvider
{
    protected StdoutLoggerInterface $stdoutLogger;

    protected LoggerInterface $logger;

    protected Dispatcher $fastRouteDispatcher;

    public function bootApp(): void
    {
        /**
         * @var Server $server
         */
        $server = $this->container()
            ->make(ServerFactory::class)
            ->start();
        $this->stdoutLogger = $this->container()
            ->get(StdoutLoggerInterface::class);
        $this->logger = $this->container()
            ->get(LoggerFactory::class)
            ->get();
        $this->stdoutLogger->debug('Websocket-Server Start Successfully#');
        $this->makeFastRoute();

        $this->loop();

        while (true) {
            try {
                $connection = $server->acceptConnection();
                SwowCoroutine::create(function () use ($connection) {
                    try {
                        while (true) {
                            $time = microtime(true);
                            $request = null;
                            try {
                                /**
                                 * @var Request $request
                                 */
                                $request = $connection->recvHttpRequestTo(make(Request::class));
                                $response = $this->dispatcher($request, $connection);
                                if ($response instanceof Response) {
                                    $connection->sendHttpResponse($response);
                                } else {
                                    $response = new Response();
                                }
                            } catch (Throwable $exception) {
                                if ($exception instanceof HttpException) {
                                    $connection->error($exception->getCode(), $exception->getMessage());
                                }
                                throw $exception;
                            } finally {
                                if ($request === null) {
                                    return;
                                }

                                if (env('DEBUG')) {
                                    /* @var LoggerInterface $logger */
                                    $logger = $this->container()
                                        ->get(LoggerFactory::class)
                                        ->get('request');
                                    // 日志
                                    $time = microtime(true) - $time;
                                    $debug = 'URI: ' . $request->getUri()->getPath() . PHP_EOL;
                                    $debug .= 'TIME: ' . $time * 1000 . 'ms' . PHP_EOL;
                                    if ($customData = $request->getCustomData()) {
                                        $debug .= 'DATA: ' . $customData . PHP_EOL;
                                    }
                                    $debug .= 'REQUEST: ' . $request->getRequestString() . PHP_EOL;
                                    $debug .= 'RESPONSE: ' . $request->getResponseString($response) . PHP_EOL;
                                    if (isset($exception) && $exception instanceof Throwable) {
                                        $debug .= 'EXCEPTION: ' . $exception->getMessage() . PHP_EOL;
                                    }

                                    if ($time > 1) {
                                        $logger->error($debug);
                                    } else {
                                        $logger->info($debug);
                                    }
                                }
                            }
                            if (!$request->getKeepAlive()) {
                                break;
                            }
                        }
                    } catch (Throwable $throwable) {
                        \Chevere\ThrowableHandler\throwableHandler($throwable);
                        // you can log error here
                    } finally {
                        # # close session
                        $connection->close();
                    }
                });
            } catch (SocketException|CoroutineException $exception) {
                if (in_array($exception->getCode(), [Errno::EMFILE, Errno::ENFILE, Errno::ENOMEM], true)) {
                    sleep(1);
                } else {
                    break;
                }
            }
        }
    }

    /**
     * 测试代码
     */
    /*
    protected function RedisSubscriber(): void
    {
        \Swow\Coroutine::run(function () {
            $sub = new Subscriber('127.0.0.1', 6379, '', 5000); // 连接失败将抛出异常
            $sub->subscribe('foo', 'bar'); // 订阅失败将抛出异常

            $chan = $sub->channel();
            while (true) {
                $data = $chan->pop();
                if (empty($data)) { // 手动close与redis异常断开都会导致返回false
                    if (!$sub->closed) {
                        // redis异常断开处理
                        var_dump('Redis connection is disconnected abnormally');
                    }
                    break;
                }
                var_dump($data);
            }
        });
    }
    */

    /**
     * 测试redis-lock
     */
    /*
    protected function RedisLock()
    {
        try {
            $lock = new RedisLock($this->container());
            if (!$lock->lock('test', 1, 3)) {
                $this->stdoutLogger->error('Lock Failure');
            }
            $this->stdoutLogger->info('Lock Success');
            sleep(10);
            $lock->unLock();
        } catch (Throwable $e) {
            dd($e);
        }
    }
    */

    protected function makeFastRoute(): void
    {
        $this->fastRouteDispatcher = simpleDispatcher(function (RouteCollector $router) {
            $router->get('/chat', function () {
                /**
                 * @var Request $request
                 */
                $request = Context::get(RequestInterface::class);
                if ($upgrade = $request->getUpgrade()) {
                    /**
                     * @var Connection $connection
                     */
                    $connection = Context::get('connection');

                    if ($upgrade === $request::UPGRADE_WEBSOCKET) {
                        try {
                            /**
                             * @var MiddlewareInterface[] $middlewares
                             */
                            $middlewares = config('websocket.middlewares');
                            $handler = config('websocket.handler');
                            $class = $this->container()->get($handler);
                            if (!$class instanceof HandlerInterface) {
                                throw new InvalidArgumentException('Invalid handler');
                            }
                            $dispatcher = make(WsDispatcher::class, [
                                'middlewares' => $middlewares,
                            ]);
                            $dispatcher->dispatch($request, $connection);
                            $connection->upgradeToWebSocket($request);
                            $request = null;
                            FdCollector::add($connection);
                            while (true) {
                                $frame = $connection->recvWebSocketFrame();
                                $opcode = $frame->getOpcode();
                                switch ($opcode) {
                                    case Opcode::PING:
                                        $connection->sendString(Frame::PONG);
                                        break;
                                    case Opcode::BINARY:
                                    case Opcode::PONG:
                                        break;
                                    case Opcode::CLOSE:
                                        $fd = $connection->getFd();
                                        FdCollector::del($fd);
                                        $this->stdoutLogger->debug("[WebSocket] Client closed session #{$fd}");
                                        break 2;
                                    default:
                                        $class->process($connection, $frame);
                                }
                            }
                        } catch (Throwable $e) {
                            $this->logger->error(format_throwable($e));
                            if ($e instanceof HttpException) {
                                /* @noinspection PhpVoidFunctionResultUsedInspection */
                                return $connection->error($e->getCode(), $e->getMessage());
                            }

                            /* @noinspection PhpVoidFunctionResultUsedInspection */
                            return $connection->error(Status::INTERNAL_SERVER_ERROR, $e->getMessage());
                        }
                    }
                    throw new HttpException(Status::BAD_REQUEST, 'Unsupported Upgrade Type');
                }

                /**
                 * $jws = make(Jws::class,[
                 * $this->container()
                 * ]);
                 *
                 * $coreJws = $jws->create([
                 * 'iat' => time(),
                 * 'nbf' => time(),
                 * 'exp' => time() + 3600,
                 * 'iss' => 'My service',
                 * 'aud' => 'Your application',
                 * ]);
                 * $joseJws = $jws->unserialize('eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MzcyMTY3OTQsIm5iZiI6MTYzNzIxNjc5NCwiZXhwIjoxNjM3MjIwMzk0LCJpc3MiOiJNeSBzZXJ2aWNlIiwiYXVkIjoiWW91ciBhcHBsaWNhdGlvbiJ9.m0yj0AtOQVske15RJjIBJ4Zdhwj4TN006coKLARBGKQ');
                 * dd($joseJws->getPayload());
                 */
                $response = new Response();

                $response->text(file_get_contents(BASE_PATH . '/public/chat.html'));

                return $response;
            });
            $router->get('/', function () {
                $response = new Response();

                $response->text(file_get_contents(BASE_PATH . '/public/welcome.html'));

                return $response;
            });
            // 加载静态资源
            $router->get('/assets/{path:.+}', function ($path) {
                $response = new Response();
                if (false === ($index = strrpos($path, '.'))) {
                    $response->text('');

                    return $response;
                }
                $type = substr($path, $index);
                $header = $response::RESPONSE_HEADER[$type] ?? '';
                $response->setHeader('Content-Type', $header)->getBody()->write(file_get_contents(BASE_PATH . '/public/assets/' . $path));

                return $response;
            });
        }, [
            'routeCollector' => RouteCollector::class,
        ]);
    }

    protected function dispatcher(SwowRequest $request, Connection $connection): Response|bool
    {
        $channel = new Channel();
        SwowCoroutine::create(function () use ($request, $channel, $connection) {
            SwowCoroutine::defer(static function () {
                Context::destroy(RequestInterface::class);
                Context::destroy('connection');
            });
            Context::set('connection', $connection);
            Context::set(RequestInterface::class, $request);
            $uri = $request->getUri()->getPath();
            $method = $request->getMethod();
            if (false !== $pos = strpos($uri, '?')) {
                $uri = substr($uri, 0, $pos);
            }
            $uri = rawurldecode($uri);
            $routeInfo = $this->fastRouteDispatcher->dispatch($method, $uri);
            $response = null;
            switch ($routeInfo[0]) {
                case Dispatcher::NOT_FOUND:
                    $response = new Response();
                    $response->error(Status::NOT_FOUND, 'Not Found');
                    break;
                case Dispatcher::METHOD_NOT_ALLOWED:
                    $response = new Response();
                    $response->error(Status::NOT_ALLOWED, 'Method Not Allowed');
                    break;
                case Dispatcher::FOUND:
                    [, $handler, $vars] = $routeInfo;
                    try {
                        $response = call($handler[0], $vars);
                        break;
                    } catch (Throwable $exception) {
                        throwableHandler($exception, sprintf(
                            '😭请求接口{%s}发生了错误,trace_id:%s,memory_usage:%s',
                            $request->getUri()->getPath(),
                            Context::getOrSet(AppendRequestIdProcessor::TRACE_ID, Uuid::uuid4()->toString()),
                            memory_usage()
                        ));
                        $this->logger->error(format_throwable($exception));
                        $response = new Response();
                        $response->error(Status::INTERNAL_SERVER_ERROR);
                        break;
                    }
            }
            if ($response instanceof Response) {
                $channel->push($response);
            } else {
                $channel->push(true);
            }
        });

        return $channel->pop();
    }

    protected function loop(): void
    {
        SwowCoroutine::create(function () {
            while (true) {
                $this->stdoutLogger->debug(sprintf('[WebSocket] current connections#[%s] [%s]', FdCollector::getActiveConnections(), Carbon::now()->toDateTimeString()));
                sleep(10);
            }
        });
    }
}
