'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/sdk.test.js', () => {
  let ctx;
  let projectUniqId;
  let interfaceGroupUniqId;
  let interfaceUniqId;
  let sceneGroupUniqId;

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
        pathname: 'api/path',
        method: 'ALL',
        description: 'description',
        groupUniqId: interfaceGroupUniqId,
      },
    ]);
    interfaceUniqId = _interfaceUniqId;
    const [{ uniqId: _sceneGroupUniqId }] = await ctx.model.Group.bulkCreate([
      {
        groupName: 'sceneGroup1',
        groupType: 'Scene',
        belongedUniqId: interfaceUniqId,
      },
    ]);
    sceneGroupUniqId = _sceneGroupUniqId;
  });

  it('GET /api/sdk/scene_data get scene data', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });
    const { body: createBody } = await app.httpRequest()
      .get('/api/sdk/scene_data?hub=baz&pathname=api/path&scene=waldo');
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {
        success: true,
      },
    });
  });

  it('GET /api/sdk/scene_data get scene data, interface fail', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    app.mockService('interface', 'queryInterfaceByHTTPContext', function* () {
      return {
        success: false,
      };
    });

    const body = await app.httpRequest()
      .get('/api/sdk/scene_data?hub=baz&pathname=api/path&scene=waldo1');
    assert(body.status === 302);
  });

  it('GET /api/sdk/scene_data get scene data, project fail', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    app.mockService('project', 'queryProjectByName', function* () {
      return {
        success: false,
      };
    });
    const body = await app.httpRequest()
      .get('/api/sdk/scene_data?hub=baz&pathname=api/path&scene=waldo');
    assert(body.status === 302);
  });

  it('POST /api/sdk/switch_scene switch scene data', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'default',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'fail',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: false },
      });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/switch_scene')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        scene: 'fail',
        tagName: 'fail',
        status: 200,
        delay: 2,
        headers: {
          name: 'DataHub',
        },
      });
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {},
    });

    const { body: createBody1 } = await app.httpRequest()
      .post('/api/sdk/switch_scene')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        contextConfig: {},
        scene: 'fail',
      });
    assert.deepStrictEqual(createBody1, {
      success: true,
      data: {},
    });
  });

  it('POST /api/sdk/switch_scene switch scene data, interface fail', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    app.mockService('interface', 'queryInterfaceByHTTPContext', function* () {
      return {
        success: false,
      };
    });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/switch_scene')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        contextConfig: {},
        scene: 'fail',
      });
    assert.deepStrictEqual(createBody, {
      success: false,
      message: '',
    });
  });

  it('POST /api/sdk/switch_scene switch scene data, project fail', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    app.mockService('project', 'queryProjectByName', function* () {
      return {
        success: false,
      };
    });
    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/switch_scene')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        scene: 'fail',
      });
    assert.deepStrictEqual(createBody, {
      success: false,
      message: '',
    });
  });

  it('POST /api/sdk/switch_multi_scenes switch multi scene data', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'default',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'fail',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: false },
      });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/switch_multi_scenes')
      .send([{
        hub: 'baz',
        pathname: 'api/path',
        contextConfig: {},
        scene: 'fail',
      }]);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {},
    });
  });

  it('POST /api/sdk/switch_all_scenes switch all scene data', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'default',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'fail',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: false },
      });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/switch_all_scenes')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        scene: 'fail',
        tagName: 'fail',
      });
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {},
    });

    const { body: createBody1 } = await app.httpRequest()
      .post('/api/sdk/switch_all_scenes')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        contextConfig: {},
        scene: 'fail',
      });
    assert.deepStrictEqual(createBody1, {
      success: true,
      data: {},
    });
  });

  it('POST /api/sdk/switch_all_scenes switch all scene data, project fail', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    app.mockService('project', 'queryProjectByName', function* () {
      return {
        success: false,
      };
    });
    const body = await app.httpRequest()
      .post('/api/sdk/switch_all_scenes')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        contextConfig: {},
        scene: 'fail',
      });
    assert(body.status === 302);
  });

  it('POST /api/sdk/switch_all_scenes switch all scene data, scene fail', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    app.mockService('scene', 'querySceneByInterfaceUniqIdAndSceneName', function* () {
      return {
        success: false,
      };
    });
    const { body: createBody1 } = await app.httpRequest()
      .post('/api/sdk/switch_all_scenes')
      .send({
        hub: 'baz',
        pathname: 'api/path',
        contextConfig: {},
        scene: 'fail',
      });
    assert.deepStrictEqual(createBody1, {
      success: true,
      data: {},
    });
  });

  it('POST /api/sdk/switch_all_proxy switch all proxy', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'default',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/switch_all_proxy')
      .send({
        projectUniqId,
        enabled: true,
      });
    assert.deepStrictEqual(createBody, {
      success: true,
      data: null,
    });
  });

  it('POST /api/sdk/add_global_proxy add global proxy', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'default',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    await app.httpRequest()
      .post('/api/sdk/add_global_proxy')
      .send({
        projectUniqId,
        globalProxy: 'http://127.0.0.1',
      });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/add_global_proxy')
      .send({
        projectUniqId,
        globalProxy: 'http://127.0.0.2',
      });

    assert.deepStrictEqual(createBody, {
      success: true,
      data: null,
    });
  });

  it('POST /api/sdk/export_data export data', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'default',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });

    const { body: createBody } = await app.httpRequest()
      .post('/api/sdk/export_data');
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {},
    });
  });
});

