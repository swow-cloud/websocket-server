<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Handler;

use Psr\Container\ContainerInterface;
use SwowCloud\Contract\StdoutLoggerInterface;
use SwowCloud\WebSocket\Sender;

abstract class AbstractWsHandler implements HandlerInterface
{
    public function __construct(Sender $sender, ContainerInterface $container)
    {
        $this->sender = $sender;
        $this->container = $container;
        $this->logger = $this->container->get(StdoutLoggerInterface::class);
    }
}
