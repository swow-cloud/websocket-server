<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket\Middleware;

use Psr\Http\Message\RequestInterface;
use Swow\Http\Server\Connection;

class Dispatcher
{
    /**
     * @var MiiddlewareInterface[]
     */
    protected array $middlewares = [];

    public function __construct(array $middlewares)
    {
        $this->middlewares = $middlewares;
    }

    public function dispatch(RequestInterface $request, Connection $connection): void
    {
        //TODO 需要考虑如何停止中间件
        foreach ($this->middlewares as $middleware) {
            $middleware->auth($request, $connection);
        }
    }
}
