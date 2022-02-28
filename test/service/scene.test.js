'use strict';

const path = require('path');
const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/scene.test.js', () => {
  let ctx;
  let projectUniqId;
  let interfaceGroupUniqId;
  let interfaceUniqId;

  beforeEach(async () => {
    ctx = app.mockContext();

    const [{ uniqId: _projectUniqId }] = await ctx.model.Project.bulkCreate([
      {
        projectName: 'baz',
        description: 'bazd',
      },
    ]);
    projectUniqId = _projectUniqId;
    const [{ uniqId: _interfaceGroupUniqId }] = await ctx.model.Group.bulkCreate([
      {
        groupName: 'interfaceGroup1',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
    ]);
    interfaceGroupUniqId = _interfaceGroupUniqId;
    const [{ uniqId: _interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      {
        projectUniqId,
        pathname: 'api/one',
        method: 'ALL',
        description: 'description',
        groupUniqId: interfaceGroupUniqId,
      },
    ]);
    interfaceUniqId = _interfaceUniqId;
  });

  describe('query scene', () => {
    let sceneUniqIdOne;

    beforeEach(async () => {
      const res = await ctx.model.Scene.bulkCreate([
        { interfaceUniqId, sceneName: 'success', contextConfig: {}, data: { id: 'success' } },
        { interfaceUniqId, sceneName: 'fail', contextConfig: {}, data: { id: 'fail' } },
      ]);
      sceneUniqIdOne = res[0].uniqId;
    });

    it('querySceneByInterfaceUniqId', async () => {
      const res = await ctx.service.scene.querySceneByInterfaceUniqId({
        interfaceUniqId,
      });
      assert(res.length === 2);
      assert(res[0] instanceof ctx.model.Scene);
      assert(res[1] instanceof ctx.model.Scene);
      assert(res[0].sceneName === 'success');
      assert.deepEqual(res[0].contextConfig, {});
      assert.deepStrictEqual(res[0].data, {
        id: 'success',
      });
      assert(res[0].interfaceUniqId === interfaceUniqId);
      assert(res[1].sceneName === 'fail');
      assert.deepStrictEqual(res[1].data, {
        id: 'fail',
      });
      assert(res[1].interfaceUniqId === interfaceUniqId);
      assert.deepEqual(res[1].contextConfig, {});
    });

    it('querySceneByInterfaceUniqIdAndSceneName', async () => {
      const res = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
        interfaceUniqId,
        sceneName: 'success',
      });
      assert(res.sceneName === 'success');
      assert.deepStrictEqual(res.data, {
        id: 'success',
      });
      assert(res instanceof ctx.model.Scene);
      assert(res.interfaceUniqId === interfaceUniqId);
    });

    it('querySceneByUniqId', async () => {
      const res = await ctx.service.scene.querySceneByUniqId({
        uniqId: sceneUniqIdOne,
      });
      assert(res.sceneName === 'success');
      assert.deepStrictEqual(res.data, {
        id: 'success',
      });
      assert(res instanceof ctx.model.Scene);
      assert(res.interfaceUniqId === interfaceUniqId);
    });
  });

  describe('operation', () => {
    let sceneUniqIdOne;
    beforeEach(async () => {
      const res = await ctx.model.Scene.bulkCreate([
        { interfaceUniqId, sceneName: 'success', data: { id: 'success' } },
        { interfaceUniqId, sceneName: 'fail', data: { id: 'fail' } },
      ]);
      sceneUniqIdOne = res[0].uniqId;
    });

    it('createScene', async () => {
      await ctx.service.scene.createScene({
        interfaceUniqId,
        sceneName: 'default',
        data: { id: 'default' },
      });
      const res = await ctx.model.Scene.findAll({
        where: {
          interfaceUniqId,
        },
      });
      assert(res.length === 3);
      assert(res[0].sceneName === 'success');
      assert(res[1].sceneName === 'fail');
      assert(res[2].sceneName === 'default');
    });

    it('updateScene', async () => {
      await ctx.service.scene.updateScene({
        uniqId: sceneUniqIdOne,
        payload: {
          sceneName: 'success-x',
          data: { id: 'success-x' },
        },
      });
      const res = await ctx.model.Scene.findAll({
        where: {
          interfaceUniqId,
        },
      });
      assert(res.length === 2);
      assert(res[0].sceneName === 'success-x');
      assert(res[1].sceneName === 'fail');
    });

    it('deleteSceneByUniqId', async () => {
      await ctx.service.scene.deleteSceneByUniqId({
        uniqId: sceneUniqIdOne,
      });
      const res = await ctx.model.Scene.findAll({
        where: {
          interfaceUniqId,
        },
      });
      assert(res.length === 1);
      assert(res[0].sceneName === 'fail');
    });

    it('downloadInterface', async () => {
      const res = await ctx.service.transfer.downloadInterface({
        interfaceUniqId,
      });

      assert(res.data.scenes.length === 2);
      assert(res.data.scenes[0].sceneName === 'success');
      assert(res.data.scenes[1].sceneName === 'fail');
    });

    it('uploadInterface', async () => {
      const res = await app.httpRequest()
        .post('/api/interface/upload')
        .attach(interfaceUniqId, path.join(__dirname, '..', 'fixtures/upload_data/', 'interface.json'))
        .expect(200);

      assert(res.body.success === true);

      const scenes = await ctx.model.Scene.findAll({
        where: {
          interfaceUniqId: res.body.newInterfaceUniqId,
        },
      });

      assert(scenes.length === 2);
      assert(scenes[0].sceneName === 'success');
      assert(scenes[1].sceneName === 'fail');
    });
  });
});
