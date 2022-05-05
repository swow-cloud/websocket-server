<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Console;

use SwowCloud\WsServer\Kernel\Provider\KernelProvider;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

/**
 * @command php bin/swow-cloud server:start
 */
final class ServerCommand extends Command
{
    protected static $defaultName = 'server:start';

    protected const COMMAND_PROVIDER_NAME = 'WebSocket-Server';

    protected function configure(): void
    {
        $this->setDescription('Start WebSocket Server')
            ->setHelp('This command allows you start MusicServer...');
    }

    public function handle(): int
    {
        $this->showLogo();
        $this->bootStrap();

        return SymfonyCommand::SUCCESS;
    }

    protected function bootStrap(): void
    {
        KernelProvider::create(self::COMMAND_PROVIDER_NAME)
            ->bootApp();
    }
}
