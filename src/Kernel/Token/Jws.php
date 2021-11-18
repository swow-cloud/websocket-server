<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Kernel\Token;

use Hyperf\Contract\ConfigInterface;
use Hyperf\Utils\Codec\Json;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\JWS as JoseJWS;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\JWSSerializer;
use Psr\Container\ContainerInterface;

class Jws
{
    protected ConfigInterface $config;

    protected AlgorithmManager $algorithmManager;

    protected JWK $jwk;

    protected JWSBuilder $jwsBuilder;

    protected JWSSerializer $serializer;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->config = $this->container->get(ConfigInterface::class);
        $this->algorithmManager = make(AlgorithmManager::class, [
            'algorithms' => make($this->config->get('jws.signature_algorithms')),
        ]);
        $this->jwk = make(JWK::class, [
            'values' => [
                'kty' => $this->config->get('jws.kty'),
                'key' => $this->config->get('jws.key'),
            ],
        ]);
        $this->jwsBuilder = make(JWSBuilder::class, [
            'signatureAlgorithmManager' => $this->algorithmManager,
        ]);
        $this->serializer = make($this->config->get('jws.serializer'));
    }

    public function create(array $payload): JoseJWS
    {
        return $this->jwsBuilder->create()->withPayload(Json::encode($payload))->addSignature($this->jwk, [
            'alg' => 'HS256',
        ])->build();
    }

    public function serialize(JoseJWS $JWS): string
    {
        return $this->serializer->serialize($JWS);
    }
}
