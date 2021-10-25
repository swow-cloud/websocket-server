<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\WebSocket;

use Swow\Http\Server\Connection;

class FdGetter
{
    public function get(Connection $connection): int
    {
        return $connection->getFd();
    }
}
