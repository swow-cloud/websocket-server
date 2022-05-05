<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Middleware;

use Psr\Http\Message\RequestInterface;
use Swow\Http\Server\Connection;
use SwowCloud\WebSocket\Middleware\MiddlewareInterface;

class WsHandShakeMiddleware implements MiddlewareInterface
{
    public function process(RequestInterface $request, Connection $connection): void
    {
        // throw new Exception
//        throw new \RuntimeException('failed to process request');
    }
}
