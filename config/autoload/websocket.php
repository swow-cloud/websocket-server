<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

use SwowCloud\WebSocket\Handler\ExampleHandler;
use SwowCloud\WebSocket\Middleware\RateLimitMiddleware;
use SwowCloud\WebSocket\Middleware\WsHandShakeMiddleware;

return [
    'handler' => ExampleHandler::class,
    'middlewares' => [
        WsHandShakeMiddleware::class,
        RateLimitMiddleware::class,
    ],
];
