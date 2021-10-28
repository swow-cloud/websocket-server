<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Kernel\Coroutine;

class ParallelExecutionException extends \RuntimeException
{
    private array $results;

    private array $throwables;

    public function getResults(): array
    {
        return $this->results;
    }

    public function setResults(array $results): void
    {
        $this->results = $results;
    }

    public function getThrowables(): array
    {
        return $this->throwables;
    }

    public function setThrowables(array $throwables): array
    {
        return $this->throwables = $throwables;
    }
}
