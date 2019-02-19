'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/api/preivew.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('GET /api/preview/scene preview scene data', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        contextConfig: {},
        data: { success: true },
      });
    const { body: createBody } = await app.httpRequest()
      .get(`/api/preview/scene?interfaceUniqId=${interfaceUniqId}&sceneName=waldo`);
    assert.deepStrictEqual(createBody, {
      success: true,
    });
  });


  it('GET /api/preview/scene preview scene data fail', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        contextConfig: {},
        data: { success: true },
      });
    const body = await app.httpRequest()
      .get(`/api/preview/scene?interfaceUniqId=${interfaceUniqId}&sceneName=waldo1`);
    assert(body.status === 204);
  });
});
