<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket;

use Psr\Container\ContainerInterface;
use Swow\Http\Exception;
use Swow\Http\Status;
use Swow\Http\WebSocketFrame;
use Swow\Socket\Exception as SocketException;
use SwowCloud\WebSocket\Contract\StdoutLoggerInterface;
use SwowCloud\WebSocket\WebSocket\Exception\BadRequestException;

class Sender
{
    protected ContainerInterface $container;

    /**
     * @var mixed|\SwowCloud\WebSocket\Contract\StdoutLoggerInterface
     */
    protected StdoutLoggerInterface $logger;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->logger = $this->container->get(StdoutLoggerInterface::class);
    }

    /**
     * Push Message
     */
    public function push(int $fd, string|WebSocketFrame $message, ?int $timeout = null): void
    {
        try {
            $connection = FdCollector::get($fd);
            if ($connection->getType() !== $connection::TYPE_WEBSOCKET) {
                throw new Exception(Status::BAD_GATEWAY, 'Unsupported Upgrade Type');
            }
            if (is_string($message)) {
                $connection->sendString($message, $timeout);
            } else {
                $connection->sendWebSocketFrame($message);
            }
            $this->logger->debug("[WebSocket] send to #{$fd}");
        } catch (SocketException|BadRequestException $e) {
            $this->logger->error(sprintf('[WebSocket] send to #%s failed: %s', $fd, $e->getMessage()));
        }
    }

    /**
     * Disconnect
     */
    public function disconnect(int $fd): void
    {
        try {
            $connection = FdCollector::get($fd);
            if ($connection->getType() !== $connection::TYPE_WEBSOCKET) {
                throw new Exception(Status::BAD_GATEWAY, 'Unsupported Upgrade Type');
            }
            $connection->close();
            FdCollector::del($fd);
        } catch (SocketException $e) {
            $this->logger->error(sprintf('[WebSocket] closed to #%s failed: %s', $fd, $e->getMessage()));
        }
    }

    /**
     * Broadcast message
     */
    public function broadcastMessage(string|WebSocketFrame $message, array $connections = null): void
    {
        if ($connections === null) {
            $connections = FdCollector::getConnections();
        }
        foreach ($connections as $connection) {
            if ($connection->getType() !== $connection::TYPE_WEBSOCKET) {
                continue;
            }
            try {
                if (is_string($message)) {
                    $connection->sendString($message);
                } else {
                    $connection->sendWebSocketFrame($message);
                }
            } catch (SocketException $exception) {
                /* ignore */
                $this->logger->error($exception->getMessage());
            }
        }
        $this->logger->debug('[WebSocket] send to broadcast message#');
    }
}
