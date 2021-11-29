<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Ws;

use Psr\Container\ContainerInterface;
use Swow\Http\Server\Connection;
use Swow\WebSocket\Frame;
use SwowCloud\WebSocket\FdGetter;
use SwowCloud\WebSocket\Handler\AbstractWsHandler;
use SwowCloud\WebSocket\Sender;

class ExampleHandler extends AbstractWsHandler
{
    protected FdGetter $getter;

    public function __construct(Sender $sender, ContainerInterface $container)
    {
        parent::__construct($sender, $container);
        $this->getter = make(FdGetter::class);
    }

    public function process(Connection $connection, Frame $frame): void
    {
        try {
            //单点推送
            $frame->getPayloadData()->rewind()->write("You said: {$frame->getPayloadData()}");
            $this->sender->push($connection->getFd(), $frame);
            //broadcast message
            $frame->getPayloadData()->rewind()->write(sprintf("Session:[%s] broadcast message {$frame->getPayloadData()}", $this->getter->get($connection)));
            $this->sender->broadcastMessage($frame);
        } catch (\Throwable $throwable) {
            $this->logger->error(format_throwable($throwable));
        }
    }
}
