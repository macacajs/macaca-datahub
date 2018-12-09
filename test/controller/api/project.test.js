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

  it('POST /api/project create project', async () => {
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
        data: { success: true },
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
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
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
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .get(`/api/project/download/${projectUniqId}`);
    assert(createBody[0].pathname, 'api/path');
  });
});
