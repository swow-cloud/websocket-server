<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket\Handler;

use SwowCloud\WebSocket\WebSocket\Sender;

abstract class AbstractWsHandler implements HandlerInterface
{
    public function __construct(Sender $sender)
    {
        $this->sender = $sender;
    }
}
