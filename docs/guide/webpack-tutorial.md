# Webpack Tutorial

## Installation

Macaca DataHub and DataHub Proxy Middleware are distibuted through npm. To install it, run the command line below:

```bash
$ npm i macaca-datahub --save-dev
$ npm i datahub-proxy-middleware --save-dev
```

## Sample Project

- [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

```bash
$ cd webpack-datahub-sample
$ npm i
$ npm run dev
```

Visit the DataHub page: [http://localhost:5678](http://localhost:5678)

## How a webpack project integrates DataHub

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
