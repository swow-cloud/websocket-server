<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace Serendipity\Job\Event;

use Hyperf\Contract\ConfigInterface;
use Psr\EventDispatcher\EventDispatcherInterface;
use SwowCloud\WsServer\Kernel\Provider\AbstractProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EventProvider extends AbstractProvider
{
    public function bootApp(): void
    {
        $dispatcher = new EventDispatcher();
        $this->container()
            ->set(EventDispatcherInterface::class, $dispatcher);
        $config = $this->container()
            ->get(ConfigInterface::class);
        $subscribers = $config->get('subscribers');
        foreach ($subscribers as $subscriber) {
            $subscriber = $this->container()->get($subscriber);
            if ($subscriber instanceof EventSubscriberInterface) {
                $dispatcher->addSubscriber($subscriber);
            }
        }
    }
}
