<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

use SwowCloud\WebSocket\WebSocket\Handler\HandlerInterface;
use SwowCloud\WebSocket\WebSocket\Middleware\MiddlewareInterface;

return [
    'handler' => HandlerInterface::class,
    'middlewares' => [
        MiddlewareInterface::class,
    ],
    '',
];
