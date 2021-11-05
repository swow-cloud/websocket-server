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
     * @var MiddlewareInterface[]
     */
    protected array $middlewares = [];

    public function __construct(array $middlewares)
    {
        $this->middlewares = $middlewares;
    }

    public function dispatch(RequestInterface $request, Connection $connection): void
    {
        foreach ($this->middlewares as $middleware) {
            $middleware = make($middleware);
            $middleware->process($request, $connection);
        }
    }
}
