<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Psr\Log\LogLevel;
use SwowCloud\Contract\StdoutLoggerInterface;

return [
    'APP_VERSION' => env('APP_VERSION'),
    'DEBUG' => env('DEBUG', true),
    'SHOW_DEBUG_BACKTRACE' => 'console', // or html
    StdoutLoggerInterface::class => [
        'log_level' => [
            LogLevel::ALERT,
            LogLevel::CRITICAL,
            LogLevel::DEBUG,
            LogLevel::EMERGENCY,
            LogLevel::ERROR,
            LogLevel::INFO,
            LogLevel::NOTICE,
            LogLevel::WARNING,
        ],
    ],
];
