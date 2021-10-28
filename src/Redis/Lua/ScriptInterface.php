<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Redis\Lua;

interface ScriptInterface
{
    public function getScript(): string;

    public function format($data);

    public function eval(array $arguments = [], $sha = true);
}
