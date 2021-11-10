<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket\Handler;

use Swow\Http\Server\Connection;
use Swow\WebSocket\Frame;

class ExampleHandler extends AbstractWsHandler
{
    public function process(Connection $connection, Frame $frame): void
    {
        $frame->getPayloadData()->rewind()->write("You said: {$frame->getPayloadData()}");
        $this->sender->push($connection->getFd(), $frame);
    }
}