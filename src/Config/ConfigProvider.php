<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Config;

use Hyperf\Contract\ConfigInterface;
use SwowCloud\WsServer\Kernel\Provider\AbstractProvider;

class ConfigProvider extends AbstractProvider
{
    protected static string $interface = ConfigInterface::class;

    public function bootApp(): void
    {
        $this->container()
            ->make(ConfigFactory::class);
    }
}
