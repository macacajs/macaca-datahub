'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/page.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('GET / home page', async () => {
    const body = await app.httpRequest()
      .get('/');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('<div id="app">') > -1);
  });

  it('GET /dashboard dashboard page', async () => {
    await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);

    const body = await app.httpRequest()
      .get('/dashboard');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('<div id="app">') > -1);
    assert(body.text.indexOf('\"projectName\":\"baz\"') > -1);
  });

  it('GET /project/baz project page', async () => {
    await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const body = await app.httpRequest()
      .get('/project/baz');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('<div id="app">') > -1);
    assert(body.text.indexOf('\"projectName\":\"baz\"') > -1);
  });

  it('GET /doc/baz project doc page', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const body = await app.httpRequest()
      .get('/doc/baz');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('<div id="app">') > -1);
    assert(body.text.indexOf('\"projectName\":\"baz\"') > -1);
  });

  it('GET /notfound notfound page', async () => {
    await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const body = await app.httpRequest()
      .get('/notfound');
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('<div id="app">') === -1);
  });

});
