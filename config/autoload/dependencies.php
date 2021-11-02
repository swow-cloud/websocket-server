<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Hyperf\Contract\ConfigInterface;
use SwowCloud\WebSocket\Config\ConfigFactory;
use SwowCloud\WebSocket\Contract\StdoutLoggerInterface;
use SwowCloud\WebSocket\Kernel\Logger\StdoutLogger;

return [
    ConfigInterface::class => ConfigFactory::class,
    StdoutLoggerInterface::class => StdoutLogger::class,
    Redis::class => SwowCloud\WebSocket\Redis\Redis::class,
];
