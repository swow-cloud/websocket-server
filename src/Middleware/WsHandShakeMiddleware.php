<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Middleware;

use Psr\Http\Message\RequestInterface;
use Swow\Http\Server\Connection;
use SwowCloud\WebSocket\WebSocket\Middleware\MiddlewareInterface;

class WsHandShakeMiddleware implements MiddlewareInterface
{
    public function process(RequestInterface $request, Connection $connection): void
    {
        //throw new Exception
      // throw new \Exception('failed to process request');
    }
}
