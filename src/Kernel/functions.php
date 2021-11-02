<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/music-server/blob/main/LICENSE
 */

declare(strict_types=1);

use Hyperf\Contract\ConfigInterface;
use Hyperf\Utils\ApplicationContext;

if (!function_exists('format_throwable')) {
    /**
     * @param \Throwable $throwable
     */
    function format_throwable(Throwable $throwable): string
    {
        return sprintf(
            "%s: %s(%s) in %s:%s\nStack trace:\n%s",
            get_class($throwable),
            $throwable->getMessage(),
            $throwable->getCode(),
            $throwable->getFile(),
            $throwable->getLine(),
            $throwable->getTraceAsString()
        );
    }
}

if (!function_exists('config')) {
    /**
     * @param null $default
     */
    function config(string $key, $default = null): mixed
    {
        if (!ApplicationContext::hasContainer()) {
            throw new RuntimeException('The application context lacks the container.');
        }
        $container = ApplicationContext::getContainer();
        if (!$container->has(ConfigInterface::class)) {
            throw new RuntimeException('ConfigInterface is missing in container.');
        }

        return $container->get(ConfigInterface::class)->get($key, $default);
    }
}
