# BeihangTMC 微信公众号机器人
fork自https://github.com/node-webot/weixin-robot

## 本地运行

```bash
git clone https://github.com/node-webot/webot-example.git
cd webot-example/
npm install
make start
```

其中，`make start` 命令会调用 `node app.js` 。

## 消息调试

使用 `webot-cli` [命令行工具](https://github.com/node-webot/webot-cli)来发送测试消息。

安装：

```bash
npm install webot-cli -g
```

`npm install -g` 代表全局安装 npm 模块，你可能需要 `sudo` 权限。

使用：

```
webot help            # 查看使用帮助
webot send Hello      # 发送一条叫「Hello」的消息
webot send image      # 调试图片消息
webot send location   # 调试地理位置
webot send event      # 调试事件消息
```

webot-cli 默认访问的接口地址是 http://127.0.0.1:3000 ，要调试本示例的程序，
你需要指定 webot send --des http://127.0.0.1/wechat --port 80
本例端口使用的是80

# 搭建你自己的机器人

1. fork 本仓库，修改 package.json 里的各项属性
2. 修改你自己的 app.js ，填写你在微信后台输入的 token 
3. 参考 rules/index.js ，新建你自己的回复规则

## 发布到云平台

仓库中的 `Procfile` 为 [heroku](http://www.heroku.com/) 的配置文件。
`manifest.yml` 为 [cloudfoundry](http://www.cloudfoundry.com/) 的示例配置文件。

[weixin-robot] 使用了 [@JacksonTian](https://github.com/JacksonTian) 的 [wechat](https://github.com/node-webot/wechat) 组件。
