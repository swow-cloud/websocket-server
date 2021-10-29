<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket\Handler;

use Swow\Http\Server\Connection;
use Swow\WebSocket\Frame;

interface HandlerInterface
{
    public function process(Connection $connection, Frame $frame): void;
}
