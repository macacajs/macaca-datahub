'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/api/interface.test.js', () => {
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

  it('PUT /api/interface/:uniqId delete proxy', async () => {
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
    const body = await app.httpRequest()
      .get(`/api/interface?projectUniqId=${projectUniqId}`);
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('"pathname":"api/path"') > -1);
  });

  it('GET /api/interface/:uniqId show one interfaces', async () => {
    const body = await app.httpRequest()
      .get(`/api/interface/${interfaceUniqId}`);
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    assert(body.text.indexOf('"pathname":"api/path"') > -1);
  });

  it('POST /api/interface/:uniqId add interfaces', async () => {
    const body = await app.httpRequest()
      .post('/api/interface')
      .send({
        projectUniqId,
        description: 'waldo',
        method: 'ALL',
        pathname: 'api/path/v2',
        groupUniqId: interfaceGroupUniqId,
      });
    assert(body.status === 200);
    assert(body.req.method === 'POST');

    const res = JSON.parse(body.text);

    assert(res.success === true);
    assert(res.data.pathname === 'api/path/v2');
    assert(res.data.groupUniqId === interfaceGroupUniqId);
  });

  it('DELETE /api/interface/:uniqId delete interfaces', async () => {
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/interface/${interfaceUniqId}`);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: 1,
    });
  });

  it('DELETE /api/interface/:uniqId delete interfaces fail', async () => {
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/interface/${interfaceUniqId}111`);
    assert.deepStrictEqual(createBody, {
      success: false,
      message: 'deletion execute failed',
    });
  });

  it('GET /api/interface/download download interfaces', async () => {
    const { body: createBody } = await app.httpRequest()
      .get(`/api/interface/download?interfaceUniqId=${interfaceUniqId}`);
    delete createBody.projectUniqId;
    assert.deepStrictEqual(createBody, {
      pathname: 'api/path',
      method: 'ALL',
      description: 'description',
      groupUniqId: interfaceGroupUniqId,
      currentScene: '',
      proxyConfig: {},
      sceneGroupList: [{
        groupName: 'sceneGroup1',
        groupUniqId: sceneGroupUniqId,
        sceneList: [],
      }],
      schemas: [],
    });
  });

  it('POST /api/interface/upload upload interfaces', async () => {
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
