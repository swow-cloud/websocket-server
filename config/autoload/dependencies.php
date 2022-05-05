<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Hyperf\Contract\ConfigInterface;
use SwowCloud\Contract\StdoutLoggerInterface;
use SwowCloud\WsServer\Config\ConfigFactory;
use SwowCloud\WsServer\Kernel\Logger\StdoutLogger;

return [
    ConfigInterface::class => ConfigFactory::class,
    StdoutLoggerInterface::class => StdoutLogger::class,
    Redis::class => SwowCloud\Redis\Redis::class,
];
