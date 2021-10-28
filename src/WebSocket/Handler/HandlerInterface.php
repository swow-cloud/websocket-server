<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\WebSocket\Handler;

use Psr\Http\Message\RequestInterface;
use Swow\Http\Server\Connection;

interface HandlerInterface
{
    public function process(RequestInterface $request, Connection $connection): void;
}
