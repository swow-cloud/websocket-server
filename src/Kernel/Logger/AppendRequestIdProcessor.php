<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Kernel\Logger;

use Hyperf\Context\Context;
use Monolog\Processor\MemoryProcessor;
use Ramsey\Uuid\Uuid;

class AppendRequestIdProcessor extends MemoryProcessor
{
    public const TRACE_ID = 'log.trace.id';

    public function __invoke(array $record): array
    {
        $usage = memory_get_usage($this->realUsage);

        if ($this->useFormatting) {
            $usage = $this->formatBytes($usage);
        }

        $record['extra']['memory_usage'] = $usage;
        $record['context']['trace_id'] = Context::getOrSet(self::TRACE_ID, Uuid::uuid4()->toString());

        return $record;
    }
}
