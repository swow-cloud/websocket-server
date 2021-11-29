<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Kernel\Swow;

use Hyperf\Contract\ConfigInterface;
use Psr\Container\ContainerInterface;
use Swow\Socket;
use SwowCloud\Contract\ServerInterface;
use SwowCloud\Contract\StdoutLoggerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class ServerFactory
{
    protected ContainerInterface $container;

    protected ?ServerInterface $server = null;

    protected ?EventDispatcherInterface $eventDispatcherInterface = null;

    protected ?StdoutLoggerInterface $stdoutLogger = null;

    protected ?array $config;

    public function __construct(ContainerInterface $container, StdoutLoggerInterface $logger)
    {
        $this->container = $container;
        $this->stdoutLogger = $logger;
        $this->config = $container->get(ConfigInterface::class)
            ->get('server');
    }

    public function start(): Socket|\Swow\Http\Server
    {
        return $this->getServer()
            ->start();
    }

    public function getServer(): ServerInterface
    {
        if (!$this->server instanceof ServerInterface) {
            $this->server = new Server(
                $this->container,
                $this->stdoutLogger,
            );
            $this->server->setServer(( new $this->config['server']() ) ?? new Socket());
            $this->server->setBacklog($this->config['backlog']);
            $this->server->setHost($this->config['host']);
            $this->server->setPort($this->config['port']);
            $this->server->setMulti($this->config['multi']);
            $this->server->setType($this->config['type']);
        }

        return $this->server->getServer();
    }
}
