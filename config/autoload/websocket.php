<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

use SwowCloud\WsServer\Middleware\RateLimitMiddleware;
use SwowCloud\WsServer\Middleware\WsHandShakeMiddleware;
use SwowCloud\WsServer\Ws\ExampleHandler;

return [
    'handler' => ExampleHandler::class,
    'middlewares' => [
        WsHandShakeMiddleware::class,
        RateLimitMiddleware::class,
    ],
];
