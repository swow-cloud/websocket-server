<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Hyperf\Contract\ConfigInterface;
use SwowCloud\MusicServer\Config\ConfigFactory;
use SwowCloud\MusicServer\Contract\StdoutLoggerInterface;
use SwowCloud\MusicServer\Kernel\Logger\StdoutLogger;

return [
    ConfigInterface::class => ConfigFactory::class,
    StdoutLoggerInterface::class => StdoutLogger::class,
    \Redis::class => \SwowCloud\MusicServer\Redis\Redis::class,
];
