<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket;

use Swow\Http\Server\Connection;
use SwowCloud\WebSocket\WebSocket\Exception\BadRequestException;

class FdCollector
{
    /**
     * @var array<Connection>
     */
    protected static array $connections = [];

    public static function add(Connection $connection): void
    {
        self::$connections[$connection->getFd()] = $connection;
    }

    public static function del(int $fd): void
    {
        $connection = self::$connections[$fd];
        unset(self::$connections[$fd]);
        if ($connection->isEstablished() && $connection->getType() === $connection::TYPE_WEBSOCKET) {
            $connection->close();
        }
    }

    /**
     * @return \Swow\Http\Server\Connection[]
     */
    public static function getConnections(): array
    {
        return self::$connections;
    }

    public static function get(int $fd): Connection
    {
        return self::$connections[$fd] ?? throw new BadRequestException('Unknown connection#');
    }

    /**
     * @void
     */
    public static function closeConnections(): void
    {
        foreach (self::$connections as $connection) {
            $connection->close();
        }
        self::$connections = [];
    }

    public static function getActiveConnections(): int
    {
        return count(self::$connections);
    }
}
