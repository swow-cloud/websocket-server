<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Console;

use Hyperf\Utils\Coroutine as SwowCoroutine;
use SwowCloud\WebSocket\Kernel\Provider\KernelProvider;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

/**
 * @command php bin/serendipity-job serendipity-job:start
 */
final class ServerCommand extends Command
{
    protected static $defaultName = 'server:start';

    protected const COMMAND_PROVIDER_NAME = 'Music-Server';

    protected function configure(): void
    {
        $this->setDescription('Start MusicServer')
            ->setHelp('This command allows you start MusicServer...');
    }

    public function handle(): int
    {
        $this->showLogo();

        SwowCoroutine::create(function () {
            $this->bootStrap();
        });

        return SymfonyCommand::SUCCESS;
    }

    protected function bootStrap(): void
    {
        KernelProvider::create(self::COMMAND_PROVIDER_NAME)
            ->bootApp();
    }
}
