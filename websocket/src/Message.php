<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket;

use Hyperf\Utils\Codec\Json;

class Message
{
    public static function pack(array $message): string
    {
        return Json::encode($message);
    }

    public static function unpack(string $message): array
    {
        return Json::decode($message);
    }
}
