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
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\JWSSerializer;
use Psr\Container\ContainerInterface;

/**
 * 验证签名
 */
class Jws
{
    protected ConfigInterface $config;

    protected AlgorithmManager $algorithmManager;

    protected JWK $jwk;

    protected JWSBuilder $jwsBuilder;

    protected JWSSerializer $serializer;

    protected JWSVerifier $verifier;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->config = $this->container->get(ConfigInterface::class);
        $this->algorithmManager = make(AlgorithmManager::class, [
            'algorithms' => [make($this->config->get('jws.signature_algorithms'))],
        ]);
        $this->jwk = make(JWK::class, [
            'values' => [
                'kty' => $this->config->get('jws.kty'),
                'k' => $this->config->get('jws.key'),
            ],
        ]);
        $this->jwsBuilder = make(JWSBuilder::class, [
            'signatureAlgorithmManager' => $this->algorithmManager,
        ]);
        $this->serializer = make($this->config->get('jws.serializer'));
        $this->verifier = make(JWSVerifier::class, [
            'signatureAlgorithmManager' => $this->algorithmManager,
        ]);
    }

    public function create(array $payload): JoseJWS
    {
        /*
         * ['iat' => time(),
         * 'nbf' => time(),
         * 'exp' => time() + 3600,
         * 'iss' => 'My service',
         * 'aud' => 'Your application'],
         */
        return $this->jwsBuilder->create()->withPayload(Json::encode($payload))->addSignature($this->jwk, [
            'alg' => 'HS256',
        ])->build();
    }

    public function serialize(JoseJWS $JWS): string
    {
        return $this->serializer->serialize($JWS);
    }

    public function unserialize(string $token): JoseJWS
    {
        return $this->serializer->unserialize($token);
    }

    public function verify(string $token): bool
    {
        $jws = $this->unserialize($token);

        return $this->verifier->verifyWithKey($jws, $this->jwk, 0);
    }
}
