<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WebSocket\Middleware;

use Psr\Http\Message\RequestInterface;
use RateLimit\Exception\LimitExceeded;
use RateLimit\Rate;
use RateLimit\RedisRateLimiter;
use Swow\Http\Server\Connection;
use SwowCloud\WebSocket\Redis\RedisFactory;
use SwowCloud\WebSocket\WebSocket\Middleware\MiddlewareInterface;

class RateLimitMiddleware implements MiddlewareInterface
{
    public function __construct(RedisFactory $factory)
    {
        $this->factory = $factory;
        $this->key = 'swow-cloud:redis-rateLimiter';
        //可配置
        $this->operations = config('rate_limit.operations');
        $this->interval = config('rate_limit.interval');
    }

    public function process(RequestInterface $request, Connection $connection): void
    {
        /**
         * @var \Redis $redis
         */
        $redis = $this->factory->get('default');
        $rateLimiter = new RedisRateLimiter(Rate::custom($this->operations, $this->interval), $redis);
        try {
            $rateLimiter->limit($this->key);
            //on success
        } catch (LimitExceeded $exceeded) {
            //on limit exceeded
        }
    }
}
