# datahub-proxy-middleware

[![NPM version][npm-image]][npm-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/datahub-proxy-middleware.svg
[npm-url]: https://npmjs.org/package/datahub-proxy-middleware
[coveralls-image]: https://img.shields.io/coveralls/macacajs/datahub-proxy-middleware.svg
[coveralls-url]: https://coveralls.io/r/macacajs/datahub-proxy-middleware?branch=master
[download-image]: https://img.shields.io/npm/dm/datahub-proxy-middleware.svg
[download-url]: https://npmjs.org/package/datahub-proxy-middleware

---

> datahub proxy middleware

<!-- GITCONTRIBUTOR_START -->

## Contributors

| [<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/> | [<img src="https://avatars.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/> | [<img src="https://avatars.githubusercontent.com/u/17233599?v=4" width="100px;"/><br/><sub><b>Chan-Chun</b></sub>](https://github.com/Chan-Chun)<br/> | [<img src="https://avatars.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/> | [<img src="https://avatars.githubusercontent.com/u/15025212?v=4" width="100px;"/><br/><sub><b>zhuyali</b></sub>](https://github.com/zhuyali)<br/> |
| :------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Thu Mar 18 2021 13:45:58 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## Installment

```bash
$ npm i datahub-proxy-middleware --save-dev
```

## Common Usage

```javascript
const datahubMiddleware = require('datahub-proxy-middleware');

const datahubConfig = {
  proxy: {
    '/api': {
      hub: 'project_name',
      port: 8080,
      hostname: 'localhost',
      pathOptions: {
        start: true,
      },
    },
  },
};

datahubMiddleware(app)(datahubConfig);
```

_notice_ version 6 has a break change that needs special attention, see [more details](https://github.com/pillarjs/path-to-regexp).

## Use with webpack-dev-server

[live demo](//github.com/macaca-sample/webpack-datahub-sample)

```javascript
const path = require('path');
const DataHub = require('macaca-datahub');
const datahubMiddleware = require('datahub-proxy-middleware');

// datahub config
// document: https://github.com/macacajs/macaca-datahub#configuration

const datahubConfig = {
  port: 5678,
  hostname: '127.0.0.1',
  pathOptions: {
    start: true,
    end: false
  },
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

showBoard will inject [debugger-board](//github.com/macacajs/debugger-board)

## License

The MIT License (MIT)
