'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/sdk.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('PUT /api/sdk/:scene_data get scene data', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body } = await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        data: { success: true },
      });
    const { body: createBody } = await app.httpRequest()
      .get('/api/sdk/scene_data?hub=baz&pathname=api/path&scene=waldo');
    console.log('createBody', createBody);
    console.log('body', body);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {
        success: true,
      },
    });
  });
});

