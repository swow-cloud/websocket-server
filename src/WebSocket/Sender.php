<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket;

use Psr\Container\ContainerInterface;
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

    public function push(int $fd, mixed $message): void
    {
    }

    public function disconnect(int $fd): void
    {
    }
}
