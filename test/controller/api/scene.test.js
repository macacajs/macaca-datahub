'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/scene.test.js', () => {
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
        pathname: 'api/path',
        method: 'ALL',
        description: 'description',
        groupUniqId: interfaceGroupUniqId,
      },
    ]);
    interfaceUniqId = _interfaceUniqId;
  });

  it('GET /api/scene show scene', async () => {
    const { body: { data: { uniqId: sceneUniqId } } } = await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        contextConfig: {},
        data: { success: true },
      });
    const { body: createBody } = await app.httpRequest()
      .get(`/api/scene?interfaceUniqId=${interfaceUniqId}`);
    assert.deepStrictEqual(createBody.data[0].data, {
      success: true,
    });
    assert(createBody.data[0].sceneName, 'waldo');

    const { body: createBody2 } = await app.httpRequest()
      .get(`/api/scene/${sceneUniqId}`);
    assert.deepStrictEqual(createBody2.data.data, {
      success: true,
    });
    assert(createBody2.data.sceneName, 'waldo');
  });

  it('POST /api/scene create scene', async () => {
    const { body: { data: { uniqId: sceneUniqId } } } = await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        contextConfig: {},
        data: { success: true },
      });
    const interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    const sceneData = await ctx.model.Scene.findOne({
      where: {
        uniqId: sceneUniqId,
      },
    });
    assert(interfaceData.currentScene === 'waldo');
    assert(sceneData.sceneName === 'waldo');
    assert(sceneData.interfaceUniqId=== interfaceUniqId);
  });

  it('PUT /api/scene/:uniqId update sceneName', async () => {
    const { body: { data: { uniqId: sceneUniqId } } } = await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        contextConfig: {},
        data: { success: true },
      });
    let interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    assert(interfaceData.currentScene === 'waldo');
    const { body } = await app.httpRequest()
      .put(`/api/scene/${sceneUniqId}`)
      .send({
        interfaceUniqId,
        sceneName: 'plugh',
      });
    assert.deepStrictEqual(body, {
      success: true, data: [ 1 ],
    });
    interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    assert(interfaceData.currentScene === 'plugh');
  });

  it('DELETE /api/scene/:uniqId delete scene', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'fail',
        contextConfig: {},
        data: { success: false },
      });
    const { body: { data: { uniqId: sceneUniqId } } } = await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        contextConfig: {},
        data: { success: true },
      });
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/scene/${sceneUniqId}`);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: 1,
    });
  });

  it('DELETE /api/scene/:uniqId delete scene fail', async () => {
    const { body: createBody } = await app.httpRequest()
      .delete('/api/scene/unkown');
    assert.deepStrictEqual(createBody, {
      success: false,
      message: 'deletion execute failed',
    });
  });
});
