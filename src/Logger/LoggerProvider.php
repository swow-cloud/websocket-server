<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Logger;

use SwowCloud\WebSocket\Kernel\Logger\StdoutLogger;
use SwowCloud\WebSocket\Kernel\Provider\AbstractProvider;

class LoggerProvider extends AbstractProvider
{
    public function bootApp(): void
    {
        $this->container()
            ->get(StdoutLogger::class);
    }
}
