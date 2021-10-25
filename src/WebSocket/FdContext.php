<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket;

use Swow\Http\Server\Connection;

class FdContext
{
    /**
     * @var array<Connection>
     */
    protected static array $connections = [];

    public static function add(Connection $connection): void
    {
        self::$connections[$connection->getFd()] = $connection;
    }

    public static function offline(int $fd): void
    {
        $connection = self::$connections[$fd];
        unset(self::$connections[$fd]);
        if ($connection->isEstablished()) {
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

    public static function get(int $fd, ?Connection $connection = null): ?Connection
    {
        return self::$connections[$fd] ?? $connection;
    }

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
