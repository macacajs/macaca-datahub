'use strict';

const path = require('path');
const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/interface.test.js', () => {
  let ctx;
  let projectUniqId;
  let interfaceGroupUniqId1;
  let interfaceGroupUniqId2;

  beforeEach(async () => {
    ctx = app.mockContext();

    const [{ uniqId: _projectUniqId }] = await ctx.model.Project.bulkCreate([
      {
        projectName: 'baz',
        description: 'bazd',
      },
    ]);
    projectUniqId = _projectUniqId;

    const [{ uniqId: _interfaceGroupUniqId1 }, { uniqId: _interfaceGroupUniqId2 }] = await ctx.model.Group.bulkCreate([
      {
        groupName: 'group1',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
      {
        groupName: 'group2',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
    ]);
    interfaceGroupUniqId1 = _interfaceGroupUniqId1;
    interfaceGroupUniqId2 = _interfaceGroupUniqId2;
  });

  it('queryInterfaceByHTTPContext', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one', method: 'POST', projectUniqId, description: 'api one POST', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/one/1', method: 'GET', projectUniqId, description: 'api one 1 GET', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/one/:id', method: 'GET', projectUniqId, description: 'api one :id GET', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/two', method: 'ALL', projectUniqId, description: 'api two ALL', groupUniqId: interfaceGroupUniqId1 },
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

  it('queryInterfaceByHTTPContext with shadowInterface', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one', method: 'POST', projectUniqId, description: 'api one POST', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/one/1', method: 'GET', projectUniqId, description: 'api one 1 GET', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/one/:id', method: 'GET', projectUniqId, description: 'api one :id GET', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/two', method: 'ALL', projectUniqId, description: 'api two ALL', groupUniqId: interfaceGroupUniqId1 },
    ]);
    const res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/two',
      method: 'ALL',
    });
    await ctx.model.ShadowInterface.bulkCreate([
      { tagName: 'one', originInterfaceId: res.uniqId, currentScene: 'default' },
    ]);
    const res1 = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/two',
      tagName: 'one',
    });
    assert(res1.currentScene === 'default');
    assert(res1.tagName === 'one');
    assert(res1.originInterfaceId === res.uniqId);
  });

  it('queryInterfaceByHTTPContextAndPathRegexp', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one/:id', method: 'GET', projectUniqId, description: 'api one :id GET', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/one/:id/:sid', method: 'GET', projectUniqId, description: 'api one :id :sid GET', groupUniqId: interfaceGroupUniqId1 },
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
    assert(res[1].protocol === 'http');
    assert(res[1].pathname === 'api/two');
    assert(res[1].method === 'GET');
    assert(res[1].projectUniqId === projectUniqId);
    assert(res[1].description === 'api two');
    assert(res[1].currentScene === '');
    assert.deepEqual(res[1].proxyConfig, {});
  });

  it('queryInterfaceDataByProjectUniqId', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/group1/one', projectUniqId, description: 'api one in group1', groupUniqId: interfaceGroupUniqId1 },
      { pathname: 'api/group1/two', projectUniqId, description: 'api two in group1', groupUniqId: interfaceGroupUniqId1 },
    ]);
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/group2/one', projectUniqId, description: 'api one in group2', groupUniqId: interfaceGroupUniqId2 },
    ]);
    const res = await ctx.service.interface.queryInterfaceDataByProjectUniqId({ projectUniqId });

    assert(res.interfaceGroupList.length === 2);
    assert(res.interfaceGroupList[0].groupName === 'group1');
    assert(res.interfaceGroupList[0].groupUniqId === interfaceGroupUniqId1);
    assert(res.interfaceGroupList[0].interfaceList.length === 2);
    assert(res.interfaceGroupList[0].interfaceList[0].protocol === 'http');
    assert(res.interfaceGroupList[0].interfaceList[0].pathname === 'api/group1/one');
    assert(res.interfaceGroupList[0].interfaceList[0].method === 'GET');
    assert(res.interfaceGroupList[0].interfaceList[0].projectUniqId === projectUniqId);
    assert(res.interfaceGroupList[0].interfaceList[0].groupUniqId === interfaceGroupUniqId1);
    assert(res.interfaceGroupList[0].interfaceList[0].description === 'api one in group1');
    assert(res.interfaceGroupList[0].interfaceList[0].currentScene === '');
    assert.deepEqual(res.interfaceGroupList[0].interfaceList[0].proxyConfig, {});
    assert(res.interfaceGroupList[0].interfaceList[1].protocol === 'http');
    assert(res.interfaceGroupList[0].interfaceList[1].pathname === 'api/group1/two');
    assert(res.interfaceGroupList[0].interfaceList[1].method === 'GET');
    assert(res.interfaceGroupList[0].interfaceList[1].projectUniqId === projectUniqId);
    assert(res.interfaceGroupList[0].interfaceList[1].groupUniqId === interfaceGroupUniqId1);
    assert(res.interfaceGroupList[0].interfaceList[1].description === 'api two in group1');
    assert(res.interfaceGroupList[0].interfaceList[1].currentScene === '');
    assert.deepEqual(res.interfaceGroupList[0].interfaceList[1].proxyConfig, {});

    assert(res.interfaceGroupList[1].groupName === 'group2');
    assert(res.interfaceGroupList[1].groupUniqId === interfaceGroupUniqId2);
    assert(res.interfaceGroupList[1].interfaceList.length === 1);
    assert(res.interfaceGroupList[1].interfaceList[0].protocol === 'http');
    assert(res.interfaceGroupList[1].interfaceList[0].pathname === 'api/group2/one');
    assert(res.interfaceGroupList[1].interfaceList[0].method === 'GET');
    assert(res.interfaceGroupList[1].interfaceList[0].projectUniqId === projectUniqId);
    assert(res.interfaceGroupList[1].interfaceList[0].groupUniqId === interfaceGroupUniqId2);
    assert(res.interfaceGroupList[1].interfaceList[0].description === 'api one in group2');
    assert(res.interfaceGroupList[1].interfaceList[0].currentScene === '');
    assert.deepEqual(res.interfaceGroupList[1].interfaceList[0].proxyConfig, {});

    assert(res.interfaceList.length === 3);
    assert(res.interfaceList[0] instanceof ctx.model.Interface);
    assert(res.interfaceList[1] instanceof ctx.model.Interface);
    assert(res.interfaceList[2] instanceof ctx.model.Interface);
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
  });

  it('updateShadowInterface', async () => {
    await ctx.model.Interface.bulkCreate([
      { pathname: 'api/one', method: 'POST', projectUniqId, description: 'api one POST' },
      { pathname: 'api/one/1', method: 'GET', projectUniqId, description: 'api one 1 GET' },
      { pathname: 'api/one/:id', method: 'GET', projectUniqId, description: 'api one :id GET' },
      { pathname: 'api/two', method: 'ALL', projectUniqId, description: 'api two ALL' },
    ]);
    const res = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname: 'api/two',
      method: 'ALL',
    });
    await ctx.model.ShadowInterface.bulkCreate([
      { tagName: 'one', originInterfaceId: res.uniqId, currentScene: 'default' },
    ]);
    const res1 = await ctx.service.interface.updateShadowInterface({
      originInterfaceId: res.uniqId,
      tagName: 'one',
      payload: {
        name: 'DataHub',
      },
    });
    assert(res1[0] === 1);

    const res2 = await ctx.service.interface.updateShadowInterface({
      originInterfaceId: res.uniqId,
      tagName: 'two',
      payload: {
        name: 'DataHub',
      },
    });
    assert(res2.tagName === 'two');
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

  it('downloadProject', async () => {
    await ctx.service.interface.createInterface({
      projectUniqId,
      pathname: 'api/one',
      method: 'ALL',
      description: 'api one',
      groupUniqId: interfaceGroupUniqId1,
    });
    const res = await ctx.service.transfer.downloadProject({
      uniqId: projectUniqId,
    });

    assert(res.dataGroupList[0].groupName === 'group1');
    assert(res.dataGroupList[0].groupUniqId === interfaceGroupUniqId1);
    assert(res.dataGroupList.length === 2);
    assert(res.dataGroupList[0].interfaceList[0].pathname === 'api/one');
    assert(res.dataGroupList[0].interfaceList[0].method === 'ALL');
    assert(res.dataGroupList[0].interfaceList[0].description === 'api one');
  });

  it('uploadProject', async () => {
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

  it('uploadProjectNewData', async () => {
    const res = await app.httpRequest()
      .post('/api/project/upload')
      .attach('file', path.join(__dirname, '..', 'fixtures/upload_data/', 'project_new.json'))
      .expect(200);

    assert(res.body.success === true);

    const interfaces = await ctx.model.Interface.findAll();

    assert(interfaces.length === 2);
    assert(interfaces[0].pathname === 'add');
    assert(interfaces[0].description === 'add data');
    assert(interfaces[1].pathname === 'delete');
    assert(interfaces[1].description === 'delete data');
  });

  it('uploadProject swagger.json', async () => {
    const res = await app.httpRequest()
      .post('/api/project/upload')
      .attach('file', path.join(__dirname, '..', 'fixtures/upload_data/', 'swagger.json'))
      .expect(200);

    assert(res.body.success === true);

    const interfaces = await ctx.model.Interface.findAll();

    assert(interfaces.length === 20);
    assert(interfaces[0].pathname === 'pet');
    assert(interfaces[0].description === 'Add a new pet to the store. ');
    assert(interfaces[19].pathname === 'user/:username');
    assert(interfaces[19].description === 'Delete user. This can only be done by the logged in user.');
  });

  it('uploadProject swagger.yaml', async () => {
    const res = await app.httpRequest()
      .post('/api/project/upload')
      .attach('file', path.join(__dirname, '..', 'fixtures/upload_data/', 'swagger.yaml'))
      .expect(200);

    assert(res.body.success === true);

    const interfaces = await ctx.model.Interface.findAll();

    assert(interfaces.length === 20);
    assert(interfaces[0].pathname === 'pet');
    assert(interfaces[0].description === 'Add a new pet to the store. ');
    assert(interfaces[19].pathname === 'user/:username');
    assert(interfaces[19].description === 'Delete user. This can only be done by the logged in user.');
  });
});
