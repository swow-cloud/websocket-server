<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Db\Pool;

use Hyperf\Contract\ConnectionInterface;
use SwowCloud\WsServer\Db\PDOConnection;

class PDOPool extends Pool
{
    protected function createConnection(): ConnectionInterface
    {
        return new PDOConnection($this->container, $this, $this->config);
    }
}
