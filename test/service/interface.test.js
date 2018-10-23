'use strict';

const path = require('path');
const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/interface.js', () => {
  let ctx;
  let projectUniqId;

  beforeEach(async () => {
    ctx = app.mockContext();
    const { uniqId } = await ctx.model.Project.create(
      { projectName: 'baz', description: 'bazd' }
    );
    projectUniqId = uniqId;
  });

  it('queryInterfaceByHTTPContext', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one', method: 'POST', projectUniqId, description: 'api one POST' },
      { pathname: 'api/one/1', method: 'GET', projectUniqId, description: 'api one 1 GET' },
      { pathname: 'api/one/:id', method: 'GET', projectUniqId, description: 'api one :id GET' },
      { pathname: 'api/two', method: 'ALL', projectUniqId, description: 'api two ALL' },
    ]);
    let res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/two',
      method: 'POST',
    });
    assert(res.protocol === 'http');
    assert(res.pathname === 'api/two');
    assert(res.method === 'ALL');
    assert(res.description === 'api two ALL');

    res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/one',
      method: 'POST',
    });
    assert(res.protocol === 'http');
    assert(res.pathname === 'api/one');
    assert(res.method === 'POST');
    assert(res.description === 'api one POST');

    res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/one/1',
      method: 'GET',
    });
    assert(res.protocol === 'http');
    assert(res.pathname === 'api/one/1');
    assert(res.method === 'GET');
    assert(res.description === 'api one 1 GET');

    res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/one/100',
      method: 'GET',
    });
    assert(res.protocol === 'http');
    assert(res.pathname === 'api/one/:id');
    assert(res.method === 'GET');
    assert(res.description === 'api one :id GET');
  });

  it('queryInterfaceByHTTPContextAndPathRegexp', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one/:id', method: 'GET', projectUniqId, description: 'api one :id GET' },
      { pathname: 'api/one/:id/:sid', method: 'GET', projectUniqId, description: 'api one :id :sid GET' },
    ]);
    const res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/one/path/not/found',
      method: 'GET',
    });
    assert(res === null);
  });

  it('queryInterfaceByProjectUniqId', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one', projectUniqId, description: 'api one' },
      { pathname: 'api/two', projectUniqId, description: 'api two' },
    ]);
    const res = await ctx.service.interface.queryInterfaceByProjectUniqId({ projectUniqId });
    assert(res.length === 2);
    assert(res[0] instanceof ctx.model.Interface);
    assert(res[1] instanceof ctx.model.Interface);
    assert(res[0].protocol === 'http');
    assert(res[0].pathname === 'api/one');
    assert(res[0].method === 'GET');
    assert(res[0].projectUniqId === projectUniqId);
    assert(res[0].description === 'api one');
    assert(res[0].currentScene === '');
    assert.deepEqual(res[0].proxyConfig, {});
    assert.deepEqual(res[0].contextConfig, {});
    assert(res[1].protocol === 'http');
    assert(res[1].pathname === 'api/two');
    assert(res[1].method === 'GET');
    assert(res[1].projectUniqId === projectUniqId);
    assert(res[1].description === 'api two');
    assert(res[1].currentScene === '');
    assert.deepEqual(res[1].proxyConfig, {});
    assert.deepEqual(res[1].contextConfig, {});
  });

  it('queryInterfaceByUniqId', async () => {
    const [{
      uniqId: uniqIdOne,
    }] = await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one', projectUniqId, description: 'api one' },
      { pathname: 'api/two', projectUniqId, description: 'api two' },
    ]);
    const res = await ctx.service.interface.queryInterfaceByUniqId({ uniqId: uniqIdOne });
    assert(res instanceof ctx.model.Interface);
    assert(res.protocol === 'http');
    assert(res.pathname === 'api/one');
    assert(res.method === 'GET');
    assert(res.projectUniqId === projectUniqId);
    assert(res.description === 'api one');
    assert(res.currentScene === '');
    assert.deepEqual(res.proxyConfig, {});
    assert.deepEqual(res.contextConfig, {});
  });

  it('createInterface', async () => {
    await ctx.service.interface.createInterface({
      projectUniqId,
      pathname: 'api/one',
      method: 'ALL',
      description: 'api one',
    });
    const res = await ctx.model.Interface.findAll();
    assert(res.length === 1);
    assert(res[0] instanceof ctx.model.Interface);
    assert(res[0].protocol === 'http');
    assert(res[0].pathname === 'api/one');
    assert(res[0].method === 'ALL');
    assert(res[0].projectUniqId === projectUniqId);
    assert(res[0].description === 'api one');
    assert(res[0].currentScene === '');
    assert.deepEqual(res[0].proxyConfig, {});
    assert.deepEqual(res[0].contextConfig, {});
  });

  it('updateInterface', async () => {
    const { uniqId } = await ctx.service.interface.createInterface({
      projectUniqId,
      pathname: 'api/one',
      method: 'ALL',
      description: 'api one',
    });
    await ctx.service.interface.updateInterface({
      uniqId,
      payload: {
        method: 'PUT',
      },
    });
    const res = await ctx.model.Interface.findAll();
    assert(res.length === 1);
    assert(res[0] instanceof ctx.model.Interface);
    assert(res[0].protocol === 'http');
    assert(res[0].pathname === 'api/one');
    assert(res[0].method === 'PUT');
    assert(res[0].projectUniqId === projectUniqId);
    assert(res[0].description === 'api one');
    assert(res[0].currentScene === '');
    assert.deepEqual(res[0].proxyConfig, {});
    assert.deepEqual(res[0].contextConfig, {});
  });

  it('updateAllProxy', async () => {
    await ctx.model.Interface.bulkCreate([{
      projectUniqId,
      pathname: 'api/one',
      method: 'ALL',
      description: 'api one',
    }, {
      projectUniqId,
      pathname: 'api/two',
      method: 'ALL',
      description: 'api two',
    }]);
    await ctx.service.interface.updateAllProxy({
      projectUniqId,
      enabled: true,
    });
    const res = await ctx.model.Interface.findAll({
      where: {
        projectUniqId,
      },
    });
    assert.deepStrictEqual(res[0].proxyConfig, {
      enabled: true,
    });
    assert.deepStrictEqual(res[1].proxyConfig, {
      enabled: true,
    });
  });

  it('deleteInterfaceByUniqId', async () => {
    const { uniqId } = await ctx.model.Interface.create({
      projectUniqId,
      pathname: 'api/one',
      method: 'ALL',
      description: 'api one',
    });
    const deleteCount = await ctx.service.interface.deleteInterfaceByUniqId({
      uniqId,
    });
    const res = await ctx.model.Interface.findAll({
      where: {
        projectUniqId,
      },
    });
    assert(deleteCount === 1);
    assert(res.length === 0);
  });

  it('queryProjectAllInfo', async () => {
    await ctx.service.interface.createInterface({
      projectUniqId,
      pathname: 'api/one',
      method: 'ALL',
      description: 'api one',
    });
    const res = await ctx.service.project.queryProjectAllInfo({
      uniqId: projectUniqId,
    });
    assert(res.data.length === 1);
    assert(res.data[0].pathname === 'api/one');
    assert(res.data[0].method === 'ALL');
    assert(res.data[0].description === 'api one');
  });

  it('uploadProjectByUniqId', async () => {
    const res = await app.httpRequest()
      .post('/api/project/upload')
      .attach('file', path.join(__dirname, '..', 'fixtures/upload_data/', 'project.json'))
      .expect(200);

    assert(res.body.success === true);

    const interfaces = await ctx.model.Interface.findAll();

    assert(interfaces.length === 2);
    assert(interfaces[0].pathname === 'add');
    assert(interfaces[0].description === 'add data');
    assert(interfaces[1].pathname === 'delete');
    assert(interfaces[1].description === 'delete data');
  });
});
