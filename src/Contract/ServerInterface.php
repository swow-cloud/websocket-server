<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Contract;

use Psr\Container\ContainerInterface;
use Psr\EventDispatcher\EventDispatcherInterface;
use Swow\Socket;

interface ServerInterface
{
    public function __construct(
        ContainerInterface $container,
        StdoutLoggerInterface $logger,
        EventDispatcherInterface $dispatcher
    );

    /**
     * @return ServerInterface
     */
    public function getServer(): self;

    public function start(): Socket;
}
