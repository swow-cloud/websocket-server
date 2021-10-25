<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket;

use Psr\Container\ContainerInterface;
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

    public function push(int $fd, mixed $message, ?int $timeout = null): void
    {
        $connection = FdContext::get($fd);
        $connection?->sendString($message, $timeout);
    }

    public function disconnect(int $fd): void
    {
        FdContext::offline($fd);
    }

    public function broadcastMessage(mixed $message, array $connections = null): void
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
            }
        }
    }
}