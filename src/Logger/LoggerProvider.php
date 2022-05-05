<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Logger;

use SwowCloud\WsServer\Kernel\Logger\StdoutLogger;
use SwowCloud\WsServer\Kernel\Provider\AbstractProvider;

class LoggerProvider extends AbstractProvider
{
    public function bootApp(): void
    {
        $this->container()
            ->get(StdoutLogger::class);
    }
}
