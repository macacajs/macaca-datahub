# datahub-nodejs-sdk

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/datahub-nodejs-sdk.svg
[npm-url]: https://npmjs.org/package/datahub-nodejs-sdk
[travis-image]: https://img.shields.io/travis/macacajs/datahub-nodejs-sdk.svg
[travis-url]: https://travis-ci.org/macacajs/datahub-nodejs-sdk
[codecov-image]: https://img.shields.io/codecov/c/github/macacajs/datahub-nodejs-sdk.svg
[codecov-url]: https://codecov.io/gh/macacajs/datahub-nodejs-sdk/branch/master
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/datahub-nodejs-sdk.svg
[download-url]: https://npmjs.org/package/datahub-nodejs-sdk

> DataHub Node.js SDK

## Installment

```bash
$ npm i datahub-nodejs-sdk --save-dev
```

## Common Usage

```javascript
import DataHubSDK from 'datahub-nodejs-sdk';

const sdkClient = new DataHubSDK();

// switch currentScene for 'POST api/create' to 'sucess'
await sdkClient.switchScene({
  hub: 'app',
  pathname: 'api/create',
  scene: 'success',
  method: 'POST',   // method is optional, default method is 'ALL'
})

// switch currentScene for 'GET api/read' to 'success'
// switch currentScene for 'DELETE api/delete' to 'success'
await sdkClient.switchMultiScenes([{
  hub: 'app',
  pathname: 'api/read',
  scene: 'success',
  method: 'GET',   // method is optional, default method is 'ALL'
}, {
  hub: 'app',
  pathname: 'api/delete',
  scene: 'success',
  method: 'DELETE',  // method is optional, default method is 'ALL'
}])

// switch all scenes for all pathnames under app to 'success'
await sdkClient.switchAllScenes({
  hub: 'app',
  scene: 'success',
})
```

## License

The MIT License (MIT)
