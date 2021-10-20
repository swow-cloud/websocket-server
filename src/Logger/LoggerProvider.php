<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\Logger;

use SwowCloud\MusicServer\Kernel\Logger\StdoutLogger;
use SwowCloud\MusicServer\Kernel\Provider\AbstractProvider;

class LoggerProvider extends AbstractProvider
{
    public function bootApp(): void
    {
        $this->container()
            ->get(StdoutLogger::class);
    }
}
