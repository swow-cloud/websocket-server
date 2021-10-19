<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\Kernel\Traits;

trait Singleton
{
    private static ?self $instance = null;

    public static function create(string $module = null): static
    {
        if (self::$instance instanceof self) {
            return self::$instance;
        }

        return self::$instance = new self($module);
    }
}
