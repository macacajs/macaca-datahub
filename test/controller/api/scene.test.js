'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/scene.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('PUT /api/scene/:uniqId update sceneName', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: { data: { uniqId: sceneUniqId } } } = await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
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
});
