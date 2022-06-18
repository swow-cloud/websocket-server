<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Kernel\Provider;

use SwowCloud\WsServer\Config\ProviderConfig;
use SwowCloud\WsServer\Kernel\Traits\Singleton;

class KernelProvider extends AbstractProvider
{
    use Singleton;

    public function bootApp(): void
    {
        ProviderConfig::loadProviders(
            static::$providers[$this->module][ProviderConfig::$bootApp],
            ProviderConfig::$bootApp
        );
    }

    public function bootRequest(): void
    {
    }

    public function shutdown(): void
    {
        ProviderConfig::loadProviders(
            static::$providers[$this->module][ProviderConfig::$bootShutdown],
            ProviderConfig::$bootShutdown
        );
    }
}
