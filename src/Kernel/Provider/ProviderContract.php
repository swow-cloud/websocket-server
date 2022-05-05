<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Kernel\Provider;

interface ProviderContract
{
    public function bootApp();

    public function bootRequest();

    public function shutdown();
}
