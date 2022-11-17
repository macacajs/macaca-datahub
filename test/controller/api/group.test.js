'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/api/group.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('PUT /api/interface/:uniqId update group', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'snapre', description: 'test' },
    ]);
    const [{ uniqId: groupUniqId }] = await ctx.model.Group.bulkCreate([
      {
        groupName: 'group1',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
    ]);
    const { body: createBody } = await app.httpRequest()
      .put(`/api/group/${groupUniqId}`)
      .send({
        groupName: 'newGroupName'
      });
    assert.deepStrictEqual(createBody, {
      success: true, data: [ 1 ],
    });
    const groupData = await ctx.model.Group.findOne({
      where: {
        uniqId: groupUniqId,
      },
    });
    assert(groupData.groupName === 'newGroupName');
  });

  it('GET /api/group get interface groupList', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'snapre', description: 'test' },
    ]);
    await ctx.model.Group.bulkCreate([
      {
        groupName: 'group1',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
    ]);
    const body = await app.httpRequest()
      .get(`/api/group?belongedUniqId=${projectUniqId}&groupType=Interface`);
    assert(body.status === 200);
    assert(body.req.method === 'GET');
    const res = JSON.parse(body.text);

    assert(res.success === true);
    assert(res.data.length === 1);
    assert(res.data[0].groupName === 'group1');
  });

  it('POST /api/group add interface group', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const body = await app.httpRequest()
      .post('/api/group')
      .send({
        belongedUniqId: projectUniqId,
        groupName: 'group1',
        groupType: 'Interface',
      });
    assert(body.status === 200);
    assert(body.req.method === 'POST');

    const res = JSON.parse(body.text);

    assert(res.success === true);
    assert(res.data.groupName === 'group1');
  });

  it('DELETE /api/group/:uniqId delete group', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'snapre', description: 'test' },
    ]);
    const [{ uniqId: groupUniqId }] = await ctx.model.Group.bulkCreate([
      {
        groupName: 'default_group',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
    ]);
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/group/${groupUniqId}`);
    assert.deepStrictEqual(createBody, {
      success: true,
      data: 1,
    });
  });

  it('DELETE /api/group/:uniqId delete group fail', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'snapre', description: 'test' },
    ]);
    const [{ uniqId: groupUniqId }] = await ctx.model.Group.bulkCreate([
      {
        groupName: 'default_group',
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      },
    ]);
    const { body: createBody } = await app.httpRequest()
      .delete(`/api/group/${groupUniqId}111`);
    assert.deepStrictEqual(createBody, {
      success: false,
      message: 'deletion execute failed',
    });
  });
});
