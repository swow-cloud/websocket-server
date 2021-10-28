<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Redis\Lua\Hash;

use SwowCloud\WebSocket\Redis\Lua\Script;

class HGetAllMultiple extends Script
{
    public function getScript(): string
    {
        return <<<'LUA'
    local values = {}; 
    for i,v in ipairs(KEYS) do 
        if(redis.call('type',v).ok == 'hash') then
            values[#values+1] = redis.call('hgetall',v);
        end
    end
    return values;
LUA;
    }

    public function format($data): array
    {
        $result = [];
        foreach ($data ?? [] as $item) {
            if (!empty($item) && is_array($item)) {
                $temp = [];
                foreach ($item as $i => $iValue) {
                    $temp[$iValue] = $item[++$i];
                }

                $result[] = $temp;
            }
        }

        return $result;
    }
}
