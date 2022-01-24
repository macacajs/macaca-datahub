'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/api/project.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('GET /api/project show all projects', async () => {
    await app.httpRequest()
      .post('/api/project')
      .send({
        description: 'test',
        projectName: 'test',
      });
    const { body: createBody } = await app.httpRequest()
      .get('/api/project');
    assert(createBody.data[0].description, 'test');
    assert(createBody.data[0].projectName, 'test');
  });

  it('GET /api/project/statistics show all projects', async () => {
    await app.httpRequest()
      .post('/api/project')
      .send({
        description: 'test',
        projectName: 'test',
      });
    const { body: createBody } = await app.httpRequest()
      .get('/api/project/statistics');
    assert(createBody.data[0].projectName, 'test');
    assert(createBody.data[0].capacity.size, '0B');
  });

  it('POST /api/project create project', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd', globaProxy: 'http://127.0.0.1' },
    ]);
    const [{ uniqId: interfaceGroupUniqId }] = await ctx.model.Group.bulkCreate([
      { belongedUniqId: projectUniqId, groupName: 'interfaceGroup1', groupType: 'Interface' }
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description', groupUniqId: interfaceGroupUniqId },
    ]);
    const [{ uniqId: sceneGroupUniqId }] = await ctx.model.Group.bulkCreate([
      { belongedUniqId: interfaceUniqId, groupName: 'sceneGroup1', groupType: 'Scene' }
    ])
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
        format: 'json',
      });
    const { body: createBody } = await app.httpRequest()
      .get('/api/project');
    assert(createBody.data[0].description, 'bazd');
    assert(createBody.data[0].description, 'baz');
  });

  it('PUT /api/project/:uniqId update project', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .put(`/api/project/${projectUniqId}`)
      .send({
        description: 'bazd1',
        projectName: 'baz1',
      });
    assert.deepStrictEqual(createBody, {
      success: true,
      data: [
        1,
      ],
    });

    const { body: createBody2 } = await app.httpRequest()
      .get(`/api/project/${projectUniqId}`);
    assert(createBody2.data.projectName, 'baz1');
    assert(createBody2.data.description, 'bazd1');
  });

  it('DELETE /api/project/:uniqId delete project', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceGroupUniqId }] = await ctx.model.Group.bulkCreate([
      { belongedUniqId: projectUniqId, groupName: 'interfaceGroup1', groupType: 'Interface' }
    ]);
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description', groupUniqId: interfaceGroupUniqId },
    ]);
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/project/${projectUniqId}`);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: 1,
    });
  });

  it('GET /api/project/download/:uniqId download project', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceGroupUniqId }] = await ctx.model.Group.bulkCreate([
      { belongedUniqId: projectUniqId, groupName: 'interfaceGroup1', groupType: 'Interface' }
    ]);
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description', groupUniqId: interfaceGroupUniqId },
    ]);
    const { body: createBody } = await app.httpRequest()
      .get(`/api/project/download/${projectUniqId}`);
    assert(createBody[0].interfaceList[0].pathname, 'api/path');
  });
});
