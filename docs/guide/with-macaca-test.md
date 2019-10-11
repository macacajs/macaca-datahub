# Use DataHub in testcase

## Using with jest

DataHub integrates seamlessly with jest to meet the habits of eco users such as React.

### Installation

```bash
$ npm i datahub-nodejs-sdk -D
```

### Extend your helper

```javascript
// __tests__/helper.js
import DataHubSDK from 'datahub-nodejs-sdk';

const datahubClient = new DataHubSDK({});

beforeAll(() => {
  return datahubClient.switchAllScenes({
    hub: 'hub-name',
    scene: 'default',
  });
});

import { render } from '@testing-library/react';

export {
  render,
  datahubClient,
};
```

### Test case sample

```javascript
import React from 'react';

import { render, datahubClient } from './helper';

import Component from './Component';

describe('__tests__/component.test.js', () => {
  beforeEach(() => {
    // 在渲染 snapshot 前调整依赖 API 的数据
    return datahubClient.switchScene({
      ...
    });
  });

  test('should be work', () => {
    const props = {
    };
    const { getByTestId } = render(<Component {...props} />);
    expect(getByTestId('loaded')).not.toBeNull();
  });
});
```

## Using with Macaca E2E

Experience how to use DataHub in your test cases with [hackernews-datahub](https://github.com/eggjs/examples/tree/master/hackernews-datahub).

```bash
$ git clone git@github.com:eggjs/examples.git
$ cd examples/hackernews-datahub
$ npm i
$ npm run dev:e2e
$ npm run test:e2e
```

After the test case is finished, you can view the following:

- Coverage reporter: hackernews-datahub/coverage/index.html
- Pass rate reporter: hackernews-datahub/reports/index.html

### How to use

#### Add configuration file

macaca-datahub.config.js

```javascript
'use strict';

const path = require('path');

module.exports = {
  mode: 'local',
  port: 5678, // must be 5678, same with datahub-nodejs-sdk's default port
  store: path.resolve(__dirname, 'data'),
};
```

mocha.opts

```
--reporter macaca-reporter
--require babel-register
--recursive
--timeout 60000
```

#### Add helper

```javascript
'use strict';

const wd = require('macaca-wd');

const {
  extendsMixIn,
} = require('macaca-wd/lib/helper');

extendsMixIn(wd);

exports.driver = wd.promiseChainRemote({
  host: 'localhost',
  port: process.env.MACACA_SERVER_PORT || 3456,
});

exports.BASE_URL = 'http://127.0.0.1:7001/';
```

#### Write testcase

API Document: [https://macacajs.github.io/macaca-wd/](https://macacajs.github.io/macaca-wd/)

```javascript
'use strict';

const {
  driver,
  BASE_URL,
} = require('./helper');

describe('test/datahub.test.js', () => {

  describe('page func testing', () => {

    before(() => {
      return driver
        .initWindow({
          width: 800,
          height: 600,
          deviceScaleFactor: 2,
        });
    });

    afterEach(function() {
      return driver
        .coverage()
        .saveScreenshots(this);
    });

    after(() => {
      return driver
        .switchAllScenes({ // Switch all DataHub scene data
          hub: 'hackernews',
          pathname: 'topstories.json',
          scene: 'default',
        })
        .openReporter(true)
        .quit();
    });

    it('default render should be ok', async function() {
      return driver
        .switchScene({ // Switch single interface scene data
          hub: 'hackernews',
          pathname: 'topstories.json',
          scene: 'default',
        })
        .getUrl(BASE_URL)
        .elementByCss('#wrapper > div.news-view.view.v-transition > div:nth-child(10) > span')
        .hasText('10');
    });

    it('list20 render should be ok', async function() {
      return driver
        .switchScene({
          hub: 'hackernews',
          pathname: 'topstories.json',
          scene: 'list20',
        })
        .getUrl(BASE_URL)
        .elementByCss('#wrapper > div.news-view.view.v-transition > div:nth-child(20) > span')
        .hasText('20');
    });
  });
});
```
