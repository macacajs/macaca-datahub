# Webpack 配置

## 安装

通过 npm 安装 Macaca DataHub 命令行客户端与代理中间件：

```bash
$ npm i macaca-datahub --save-dev
$ npm i datahub-proxy-middleware --save-dev
```

## 示例工程

- [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

## Webpack 集成 Datahub 服务

```javascript
const path = require('path');
const DataHub = require('macaca-datahub');
const datahubMiddleware = require('datahub-proxy-middleware');

// datahub config
// document: https://github.com/macacajs/macaca-datahub#configuration

const datahubConfig = {
  port: 5678,
  hostname: '127.0.0.1',
  store: path.join(__dirname, '..', 'data'),
  proxy: {
    '^/api': {
      hub: 'sample',
    },
  },
  showBoard: true,
};

const defaultDatahub = new DataHub({
  port: datahubConfig.port,
});

// devServer field
devServer: {
  before: app => {
    datahubMiddleware(app)(datahubConfig);
  },
  after: () => {
    defaultDatahub.startServer(datahubConfig).then(() => {
      console.log('datahub ready');
    });
  },
},
```

更多 DataHub 配置信息可参考 [自定义配置项](https://github.com/macacajs/macaca-datahub#configuration)。

