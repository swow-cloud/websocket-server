<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\Logger;

use Monolog\Logger as MonoLogger;
use SwowCloud\MusicServer\Contract\LoggerInterface;

class Logger extends MonoLogger implements LoggerInterface
{
}
