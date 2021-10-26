<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\WebSocket;

use Psr\Container\ContainerInterface;
use Swow\Http\Exception;
use Swow\Http\Status;
use Swow\Http\WebSocketFrame;
use Swow\Socket\Exception as SocketException;
use SwowCloud\MusicServer\Contract\StdoutLoggerInterface;

class Sender
{
    protected ContainerInterface $container;

    /**
     * @var mixed|\SwowCloud\MusicServer\Contract\StdoutLoggerInterface
     */
    protected StdoutLoggerInterface $logger;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->logger = $this->container->get(StdoutLoggerInterface::class);
    }

    public function push(int $fd, string|WebSocketFrame $message, ?int $timeout = null): void
    {
        try {
            $connection = FdContext::get($fd);
            if ($connection?->getType() !== $connection::TYPE_WEBSOCKET) {
                throw new Exception(Status::BAD_GATEWAY, 'Unsupported Upgrade Type');
            }
            if (is_string($message)) {
                $connection?->sendString($message, $timeout);
            } else {
                $connection?->sendWebSocketFrame($message);
            }
            $this->logger->debug("[WebSocket] send to #{$fd}");
        } catch (SocketException $e) {
            $this->logger->error(sprintf('[WebSocket] send to #%s failed: %s', $fd, $e->getMessage()));
        }
    }

    public function disconnect(int $fd): void
    {
        FdContext::offline($fd);
    }

    public function broadcastMessage(string|WebSocketFrame $message, array $connections = null): void
    {
        if ($connections === null) {
            $connections = FdContext::getConnections();
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
