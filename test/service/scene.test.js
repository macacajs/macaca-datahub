'use strict';

const path = require('path');
const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/scene.js', () => {
  let ctx;
  let projectUniqId;
  let interfaceUniqId;

  beforeEach(async () => {
    ctx = app.mockContext();
    const { uniqId: pid } = await ctx.model.Project.create(
      { projectName: 'baz', description: 'bazd' }
    );
    projectUniqId = pid;
    const { uniqId: iid } = await ctx.model.Interface.create(
      { projectUniqId, pathname: 'api/one', method: 'ALL', description: '' }
    );
    interfaceUniqId = iid;
  });

  describe('query scene', () => {
    let sceneUniqIdOne;
    beforeEach(async () => {
      const res = await ctx.model.Scene.bulkCreate([
        { interfaceUniqId, sceneName: 'success', data: { id: 'success' } },
        { interfaceUniqId, sceneName: 'fail', data: { id: 'fail' } },
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
      assert.deepStrictEqual(res[0].data, {
        id: 'success',
      });
      assert(res[0].interfaceUniqId === interfaceUniqId);
      assert(res[1].sceneName === 'fail');
      assert.deepStrictEqual(res[1].data, {
        id: 'fail',
      });
      assert(res[1].interfaceUniqId === interfaceUniqId);
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

  describe('opetation', () => {
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

    it('downloadInterfaceByUniqId', async () => {
      const res = await ctx.service.interface.downloadInterfaceByUniqId({
        interfaceUniqId,
      });

      assert(res.length === 2);
      assert(res[0].sceneName === 'success');
      assert(res[1].sceneName === 'fail');
    });

    it('uploadInterfaceByUniqId', async () => {
      const res = await app.httpRequest()
        .post('/api/interface/upload')
        .attach(interfaceUniqId, path.join(__dirname, '..', 'fixtures/upload_data/', 'interface.json'))
        .expect(200);

      assert(res.body.success === true);

      const scenes = await ctx.model.Scene.findAll({
        where: {
          interfaceUniqId,
        },
      });

      assert(scenes.length === 2);
      assert(scenes[0].sceneName === 'success');
      assert(scenes[1].sceneName === 'fail');
    });
  });
});
