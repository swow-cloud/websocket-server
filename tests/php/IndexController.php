<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

class IndexController
{
    #[Route('/index')]
    #[Route('/index_alias')]
    public function index()
    {
        echo 'hello!world' . PHP_EOL;
    }
}
