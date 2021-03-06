<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer;

use Dotenv\Dotenv;
use Hyperf\Di\Container;
use Psr\Container\ContainerInterface;
use SwowCloud\WsServer\Config\Loader\YamlLoader;
use SwowCloud\WsServer\Console\ServerCommand;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\FileLocatorInterface;
use Symfony\Component\Console\Application as SymfonyApplication;

final class Application extends SymfonyApplication
{
    protected Dotenv $dotenv;

    /**
     * @var Container
     */
    protected ContainerInterface $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        parent::__construct('MusicServer Console Tool...');
        $this->initialize();
        $this->debug();
        $this->addCommands([
            new ServerCommand(),
        ]);
    }

    public function initialize(): void
    {
        $this->initEnvironment();
        $this->initSingleton();
    }

    protected function initEnvironment(): void
    {
        // Non-thread-safe load
        $this->dotenv = Dotenv::createUnsafeImmutable(BASE_PATH);
        $this->dotenv->safeLoad();
    }

    protected function initSingleton(): void
    {
        $fileLocator = $this->container->make(FileLocator::class, ['paths' => [BASE_PATH . '/config/']]);
        $this->container->set(FileLocatorInterface::class, $fileLocator);
        $this->container->make(YamlLoader::class);
    }

    public function getContainer(): ContainerInterface|Container
    {
        return $this->container;
    }

    protected function debug(): void
    {
        if (env('DEBUG')) {
            Kernel\Swow\Debugger::runOnTTY('websocket-server');
        }
    }
}
