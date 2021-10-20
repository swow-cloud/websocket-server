<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\MusicServer\Redis\Lua\Hash;

use SwowCloud\MusicServer\Redis\Lua\Script;

class HIncrByFloatIfExists extends Script
{
    public function getScript(): string
    {
        return <<<'LUA'
    if(redis.call('type', KEYS[1]).ok == 'hash') then
        return redis.call('HINCRBYFLOAT', KEYS[1], ARGV[1], ARGV[2]);
    end
    return "";
LUA;
    }

    /**
     * @param null|float $data
     */
    public function format($data): float|int|string|null
    {
        if (is_numeric($data)) {
            return $data;
        }

        return null;
    }

    protected function getKeyNumber(array $arguments): int
    {
        return 1;
    }
}
