<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\Server;

use FastRoute\Dispatcher;
use Hyperf\Engine\Channel;
use Hyperf\Utils\Context;
use Hyperf\Utils\Coroutine as SwowCoroutine;
use Psr\Http\Message\RequestInterface;
use Swow\Http\Server\Connection;
use Swow\Http\Server\Request as SwowRequest;
use Swow\Http\Status;
use Swow\WebSocket\Frame;
use Swow\WebSocket\Opcode;
use SwowCloud\MusicServer\Contract\LoggerInterface;
use SwowCloud\MusicServer\Contract\StdoutLoggerInterface;
use SwowCloud\MusicServer\Kernel\Http\Request;
use SwowCloud\MusicServer\Kernel\Http\Response;
use SwowCloud\MusicServer\Kernel\Provider\AbstractProvider;
use SwowCloud\MusicServer\Kernel\Router\RouteCollector;
use SwowCloud\MusicServer\Kernel\Swow\ServerFactory;
use SwowCloud\MusicServer\Logger\LoggerFactory;
use Throwable;
use function FastRoute\simpleDispatcher;
use const Swow\Errno\EMFILE;
use const Swow\Errno\ENFILE;
use const Swow\Errno\ENOMEM;

/**
 * Class ServerProvider
 * @todo 1.开发api
 * @todo 2.开发ws
 */
class ServerProvider extends AbstractProvider
{
    protected StdoutLoggerInterface $stdoutLogger;

    protected LoggerInterface $logger;

    protected Dispatcher $fastRouteDispatcher;

    public function bootApp(): void
    {
        /**
         * @var \Swow\Http\Server $server
         */
        $server = $this->container()
            ->make(ServerFactory::class)
            ->start();
        $this->stdoutLogger = $this->container()
            ->get(StdoutLoggerInterface::class);
        $this->logger = $this->container()
            ->get(LoggerFactory::class)
            ->get();
        $this->stdoutLogger->debug('MusicServer Start Successfully#');
        $this->makeFastRoute();

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
                                $request = $connection->recvHttpRequest(make(Request::class));
                                $response = $this->dispatcher($request, $connection);
                                if ($response instanceof Response) {
                                    $connection->sendHttpResponse($response);
                                }
                                continue;
                            } catch (Throwable $exception) {
                                if ($exception instanceof HttpException) {
                                    $connection->error($exception->getCode(), $exception->getMessage());
                                }
                                throw $exception;
                            } finally {
                                if ($request === null) {
                                    return;
                                }
                                /*@var LoggerInterface $logger */
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
                                if (isset($response)) {
                                    $debug .= 'RESPONSE: ' . $request->getResponseString($response) . PHP_EOL;
                                }
                                if (isset($exception) && $exception instanceof Throwable) {
                                    $debug .= 'EXCEPTION: ' . $exception->getMessage() . PHP_EOL;
                                }

                                if ($time > 1) {
                                    $logger->error($debug);
                                } else {
                                    $logger->info($debug);
                                }
                            }
                            if (!$request->getKeepAlive()) {
                                break;
                            }
                        }
                    } catch (Throwable $throwable) {
                        $this->logger->error(format_throwable($throwable));
                        throw $throwable;
                        // you can log error here
                    } finally {
                        ## close session
                        $connection->close();
                    }
                });
            } catch (SocketException|CoroutineException $exception) {
                if (in_array($exception->getCode(), [EMFILE, ENFILE, ENOMEM], true)) {
                    sleep(1);
                } else {
                    break;
                }
            }
        }
    }

    protected function makeFastRoute(): void
    {
        $this->fastRouteDispatcher = simpleDispatcher(function (RouteCollector $router) {
            $router->get('/chat', function (): Response {
                /**
                 * @var Request $request
                 */
                $request = Context::get(RequestInterface::class);
                if ($upgrade = $request->getUpgrade()) {
                    /**
                     * @var \Swow\Http\Server\Connection $connection
                     */
                    $connection = Context::get('connection');

                    if ($upgrade === $request::UPGRADE_WEBSOCKET) {
                        $connection->upgradeToWebSocket($request);
                        $request = null;
                        while (true) {
                            $frame = $connection->recvWebSocketFrame();
                            $opcode = $frame->getOpcode();
                            switch ($opcode) {
                                case Opcode::PING:
                                    $connection->sendString(Frame::PONG);
                                    break;
                                case Opcode::PONG:
                                    break;
                                case Opcode::CLOSE:
                                    break 2;
                                default:
                                    $frame->getPayloadData()->rewind()->write("You said: {$frame->getPayloadData()}");
                                    $connection->sendWebSocketFrame($frame);
                            }
                        }
                    }
                    throw new HttpException(HttpStatus::BAD_REQUEST, 'Unsupported Upgrade Type');
                } else {
                    $response = new Response();
                    $response->text(file_get_contents(BASE_PATH . '/public/chat.html'));

                    return $response;
                }
            });
        }, [
            'routeCollector' => RouteCollector::class,
        ]);
    }

    protected function dispatcher(SwowRequest $request, Connection $connection): Response|bool
    {
        $channel = new Channel();
        SwowCoroutine::create(function () use ($request, $channel, $connection) {
            SwowCoroutine::defer(function () {
                Context::destroy(RequestInterface::class);
                Context::destroy('connection');
            });
            Context::set('connection', $connection);
            Context::set(RequestInterface::class, $request);
            $uri = $request->getPath();
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
}