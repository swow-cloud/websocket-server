<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Serializer;

use Symfony\Component\Serializer\Encoder\JsonEncoder;

class SymfonySerializer extends Serializer
{
    public function serialize(object $object, string $format = JsonEncoder::FORMAT): string
    {
        return $this->serializer->serialize($object, $format);
    }

    public function deserialize(
        string $serializable,
        string $type,
        string $format = JsonEncoder::FORMAT,
        array $context = []
    ): mixed {
        return $this->serializer->deserialize($serializable, $type, $format, $context);
    }
}
