<?php

declare(strict_types = 1);

class IndexController
{
    /**
     *
     * @return void
     */
    #[Route('/index')]
    #[Route('/index_alias')]
    public function index()
    {
        echo "hello!world" . PHP_EOL;
    }
}
