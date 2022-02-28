'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/controller/api/preview.test.js', () => {
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

  it('GET /api/preview/scene preview scene data', async () => {
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
