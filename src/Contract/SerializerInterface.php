<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Contract;

use Symfony\Component\Serializer\Encoder\JsonEncoder;

interface SerializerInterface
{
    public function serialize(object $object, string $format = JsonEncoder::FORMAT): string;

    public function deserialize(
        string $serializable,
        string $type,
        string $format = JsonEncoder::FORMAT,
        array $context = []
    ): mixed;
}
