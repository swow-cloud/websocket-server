<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
$pid = pcntl_fork(); // fork一个子进程
if ($pid > 0) { // 父进程会获取到fork到的子进程的进程id
    var_dump($redis);
    var_dump('我是父进程');
} elseif ($pid == 0) { // $pid=0时为刚刚派生出的子进程
    var_dump('我是子进程');
    var_dump($redis);
} else {
    var_dump('创建子进程失败');
}
