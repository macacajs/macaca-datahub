'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/api/interface.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('PUT /api/interface/:uniqId delete proxy', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          proxyList: [
            { proxyUrl: 'http://www.a.com' },
            { proxyUrl: 'http://www.b.com' },
          ],
          activeIndex: 1,
        },
      });
    assert.deepStrictEqual(createBody, {
      success: true, data: [ 1 ],
    });
    let interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    assert(interfaceData.proxyConfig.activeIndex === 1);
    const { body: updateBody } = await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          proxyList: [
            { proxyUrl: 'http://www.a.com' },
          ],
          activeIndex: 1,
        },
      });
    assert.deepStrictEqual(updateBody, {
      success: true, data: [ 1 ],
    });
    interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    assert(interfaceData.proxyConfig.activeIndex === 0);
  });

  it('GET /api/interface show all interfaces', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const body = await app.httpRequest()
      .get(`/api/interface?projectUniqId=${projectUniqId}`);
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('"pathname":"api/path"') > -1);
  });

  it('GET /api/interface/:uniqId show one interfaces', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const body = await app.httpRequest()
      .get(`/api/interface/${interfaceUniqId}`);
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('"pathname":"api/path"') > -1);
  });

  it('POST /api/interface/:uniqId add interfaces', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const body = await app.httpRequest()
      .post('/api/interface')
      .send({
        projectUniqId,
        description: 'waldo',
        method: 'ALL',
        pathname: 'api/path',
      });
    assert(body.status === 200);
    assert(body.req.method === 'POST');

    const res = JSON.parse(body.text);

    assert(res.success === true);
    assert(res.data.pathname === 'api/path');
  });

  it('DELETE /api/interface/:uniqId delete interfaces', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/interface/${interfaceUniqId}`);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: 1,
    });
  });

  it('DELETE /api/interface/:uniqId delete interfaces fail', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/interface/${interfaceUniqId}111`);
    assert.deepStrictEqual(createBody, {
      success: false,
      message: 'deletion execute failed',
    });
  });

  it('GET /api/interface/download download interfaces', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .get(`/api/interface/download?interfaceUniqId=${interfaceUniqId}`);
    delete createBody.projectUniqId;
    assert.deepStrictEqual(createBody, {
      pathname: 'api/path',
      method: 'ALL',
      description: 'description',
      contextConfig: {},
      currentScene: '',
      proxyConfig: {},
      scenes: [],
      schemas: [],
    });
  });

  it('POST /api/interface/upload upload interfaces', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .post('/api/interface/upload')
      .send({
      });
    assert.deepStrictEqual(createBody, {
      success: false,
      message: 'server error: Content-Type must be multipart/*',
    });
  });
});
