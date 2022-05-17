# websocket-server

## 功能
1.支持鉴权

2.支持限流

3.提供websocket客户端 工具

4.支持群发和单聊消息

## 命令

```bash
php bin/blend server:start  #启动server 需关掉debug模式

➜  websocket-server git:(main) ✗ php bin/blend server:start 

[02:13:58]  RUNNING  server:start
    > Started a Server in the background with PID: [18548]
[02:13:58]  DONE  10.31ms

php bin/blend server:stop   #关闭server
➜  websocket-server git:(main) ✗ php bin/blend server:stop  

[02:14:24]  RUNNING  server:stop
    > Stopped Server with PID: [18548]
[02:14:24]  DONE  5.43ms

```
# 慢慢封装一些swow的组件
