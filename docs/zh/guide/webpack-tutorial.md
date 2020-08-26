# Webpack 配置

## 安装依赖

通过 npm 安装 Macaca DataHub 命令行客户端与代理中间件：

```bash
$ npm i macaca-datahub --save-dev
$ npm i datahub-proxy-middleware --save-dev
```

## 示例工程

- [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

```bash
$ cd webpack-datahub-sample
$ npm i
$ npm run dev
```

访问 DataHub 页面: [http://localhost:5678](http://localhost:5678)

## 集成 Datahub 服务

```javascript
const path = require('path');
const DataHub = require('macaca-datahub');
const datahubMiddleware = require('datahub-proxy-middleware');

const datahubConfig = {
  port: 5678,
  hostname: '127.0.0.1',
  store: path.join(__dirname, '..', 'data'),
  proxy: {
    '/api': {
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

通过开启 showBoard，可以在右下角看到操作入口，方便在当前页面使用 DataHub。

![](/macaca-datahub/assets/databub-debugger-board-1.png)

![](/macaca-datahub/assets/databub-debugger-board-2.png)

## 代理配置

- [datahub-proxy-middleware](//github.com/macacajs/datahub-proxy-middleware#use-with-webpack-dev-server)
