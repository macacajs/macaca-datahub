'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/data.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('GET /data/baz/api/path', async () => {
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
    const body = await app.httpRequest()
      .get('/data/baz/api/path');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text === '{\"success\":true}');
  });

  it('GET /data/baz/api/path project with empty', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const body = await app.httpRequest()
      .get('/data/baz/api/path111');
    assert(body.status === 400);
    assert(body.req.method === 'GET');
    assert(body.text === '{}');
  });

  it('GET /data/baz/api/path project modify contextConfig', async () => {
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
    await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        contextConfig: {
          responseDelay: '2',
          responseStatus: '204',
          responseHeaders: {
            name: 'DataHub',
          },
        },
      });
    const body = await app.httpRequest()
      .get('/data/baz/api/path');
    assert(body.status === 204);
    assert(body.header.name === 'DataHub');
    assert(body.text === '');
  });

  it('GET /data/baz/api/path project modify proxy', async () => {
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
    await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          proxyList: [
            { proxyUrl: 'http://datahubjs.com' },
            { proxyUrl: 'http://www.b.com' },
          ],
          activeIndex: 0,
          enabled: true,
        },
      });
    const body = await app.httpRequest()
      .get('/data/baz/api/path?test=test');

    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('<div id="app">') > -1);
  });

  it('GET /data/baz/api/path get data with search', async () => {
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
      .get('/data/baz/api/path?test=test');
    assert.deepStrictEqual(createBody, {
      success: true,
    });
  });
});
