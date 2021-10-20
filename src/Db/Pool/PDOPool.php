<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\Db\Pool;

use Hyperf\Contract\ConnectionInterface;
use SwowCloud\MusicServer\Db\PDOConnection;

class PDOPool extends Pool
{
    protected function createConnection(): ConnectionInterface
    {
        return new PDOConnection($this->container, $this, $this->config);
    }
}
