<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Swow\Coroutine;
use Swow\SocketException;
use Swow\Stream\EofStream;

require __DIR__ . '/../../vendor/autoload.php';

$server = new EofStream();
$server->bind('127.0.0.1', 9764)->listen();
while (true) {
    Coroutine::run(static function (EofStream $stream) {
        echo "Stream<fd={$stream->getFd()}> accepted" . PHP_EOL;
        try {
            while (true) {
                $packet = $stream->recvMessageString();
                echo "Stream<fd={$stream->getFd()}>: \"{$packet}\"" . PHP_EOL;
                $stream->write([$packet, $stream->getEof()]);
            }
        } catch (SocketException $exception) {
            echo "Stream<fd={$stream->getFd()}> goaway, reason: {$exception->getMessage()}" . PHP_EOL;
        }
    }, $server->accept());
}
