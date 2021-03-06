<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Logger;

use Monolog\Logger as MonoLogger;
use SwowCloud\Contract\LoggerInterface;

class Logger extends MonoLogger implements LoggerInterface
{
}
