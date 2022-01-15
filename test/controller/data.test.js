'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/data.test.js', () => {
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

  it('GET /data/baz/api/path', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });
    const body = await app.httpRequest()
      .get('/data/baz/api/path');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text === '{\"success\":true}');
  });

  it('GET /data/baz/api/path support query.__datahub_scene', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'id_1',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { id: 1 },
      });
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'success',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });
    const body = await app.httpRequest()
      .get('/data/baz/api/path?__datahub_scene=id_1');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text === '{\"id\":1}');
  });

  it('GET /data/baz/api/path project with empty', async () => {
    const body = await app.httpRequest()
      .get('/data/baz/api/path111');
    assert(body.status === 400);
    assert(body.req.method === 'GET');
    assert(body.text === '{}');
  });

  it('GET /data/baz/api/path project modify contextConfig', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {
          responseDelay: '2',
          responseStatus: '204',
          responseHeaders: {
            name: 'DataHub',
          },
        },
        data: { success: true },
      });
    const body = await app.httpRequest()
      .get('/data/baz/api/path');
    assert(body.status === 204);
    assert(body.header.name === 'DataHub');
    assert(body.text === '');
  });

  it('GET /data/baz/api/path project modify proxy', async () => {
    await app.httpRequest()
      .post('/api/scene/')
      .send({
        interfaceUniqId,
        sceneName: 'waldo',
        groupUniqId: sceneGroupUniqId,
        contextConfig: {},
        data: { success: true },
      });
    await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          proxyList: [
            { proxyUrl: 'http://datahubjs.com' },
            { proxyUrl: 'http://www.b.com' },
          ],
          activeIndex: 0,
          enabled: false,
        },
      });
    const { body: createBody } = await app.httpRequest()
      .get('/data/baz/api/path');
    assert.deepStrictEqual(createBody, {
      success: true,
    });

    await app.httpRequest()
      .post(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          activeIndex: 0,
          enabled: true,
        },
      });
    await app.httpRequest()
      .get('/data/baz/api/path');
  });

  it('GET /data/baz/api/path get data with search', async () => {
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
      .get('/data/baz/api/path?test=test');
    assert.deepStrictEqual(createBody, {
      success: true,
    });
  });
});
