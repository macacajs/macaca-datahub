'use strict';

const sinon = require('sinon');
const assert = require('assert');

const SDK = require('..');

const config = require('./config');

const localhost = config.localhost;

describe('sdk test', function () {
  it('default options', function () {
    assert.ok(SDK);
  });

  it('pass options', function () {
    const client = new SDK();
    assert.deepStrictEqual(client.options, {
      port: 5678,
      hostname: '127.0.0.1',
      protocol: 'http',
      retryMaxCount: 5,
      retryInterval: 3000,
    });
  });

  it('switchScene', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.switchScene({
      hub: 'app',
      pathname: 'api',
      scene: 'success',
    }).then(data => {
      assert.deepStrictEqual(data, [
        `${localhost}/api/sdk/switch_scene`,
        { method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hub: 'app',
            pathname: 'api',
            scene: 'success',
          }),
        },
      ]);
    });
  });

  it('switchMultiScenes', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.switchMultiScenes([{
      hub: 'app',
      pathname: 'api',
      scene: 'success',
    }, {
      hub: 'app2',
      pathname: 'api2',
      scene: 'success',
    }]).then(data => {
      assert.deepStrictEqual(data, [
        `${localhost}/api/sdk/switch_multi_scenes`,
        { method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([{
            hub: 'app',
            pathname: 'api',
            scene: 'success',
          }, {
            hub: 'app2',
            pathname: 'api2',
            scene: 'success',
          }]),
        },
      ]);
    });
  });

  it('switchAllScenes', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.switchAllScenes({
      hub: 'app',
      scene: 'success',
    }).then(data => {
      assert.deepStrictEqual(data, [
        `${localhost}/api/sdk/switch_all_scenes`,
        { method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hub: 'app',
            scene: 'success',
          }),
        },
      ]);
    });
  });

  it('getSceneData', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.getSceneData({
      hub: 'app',
      pathname: 'api',
      scene: 'success',
    }).then(data => {
      assert.deepStrictEqual(data, [
        'http://127.0.0.1:5678/api/sdk/scene_data?hub=app&pathname=api&scene=success',
        {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ]);
    });
  });
});
