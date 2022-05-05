<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Jose\Component\Signature\Algorithm\HS256;
use Jose\Component\Signature\Serializer\CompactSerializer;

/*
 * JWS
 * @link https://web-token.spomky-labs.com/the-components/encrypted-tokens-jwe/jwe-loading
 */
return [
    'key' => env('JSON_WEBTOKEN_KEY'),
    'kty' => env('JSON_WEBTOKEN_KTY'),
    'serializer' => CompactSerializer::class,
    'signature_algorithms' => HS256::class,
];
