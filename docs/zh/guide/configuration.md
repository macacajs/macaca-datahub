# 配置选项

| 字段名       | 类型     | 描述                        | 默认      |
| ------------ | -------- | ------------------------- | -------- |
| port         | Number   | DataHub 服务启动端口        | 9200      |
| mode         | String   | DataHub 服务启动模式        | 'prod'    |
| protocol     | String   | DataHub 服务交互协议        | 'http'    |
| database     | String   | DataHub 数据库地址          | $HOME     |
| store        | String   | 数据流归档文件路径           | undefined |
| view         | Object   | 界面静态文件访问地址配置      | {}        |

配置示例: [macaca-datahub.config.js](./macaca-datahub.config.js)

```javascript
module.exports = {
  mode: 'local',

  port: 7001,

  store: path.resolve(__dirname, 'data'),

  view: {
    // set assets base url
    assetsUrl: 'https://npmcdn.com/datahub-view@latest',
  },
};
```

你也可以自己定制界面操作台，或者使用其他第三方用户开发的界面，比如 [datahub-platform](//github.com/zhuyali/datahub-platform) 只需要指定 `assetsUrl` 即可。

```javascript
module.exports = {
  view: {
    assetsUrl: 'https://unpkg.com/datahub-platform@latest',
  },
};

```

可以通过指定 [`.js`|`.json`] 后缀格式的配置文件。

```bash
$ datahub server -c path/to/config.js --verbose
```

## 查看原数据

DataHub 的数据持久化依赖 sqllite，通过数据库管理软件可以查看 DataHub 中的数据。

首先要进入 HOME 目录找到对应的文件。

```bash
$ cd $HOME/.macaca-datahub
```

![](/macaca-datahub/assets/datahub-sqllite.png)
