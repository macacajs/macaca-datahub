'use strict';

const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/group.test.js', () => {
  let ctx;
  let projectUniqId;

  beforeEach(async () => {
    ctx = app.mockContext();
    const [{ uniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'snapre', description: 'test' },
    ]);
    projectUniqId = uniqId;
    await ctx.model.Group.bulkCreate([
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
  });

  it('queryGroupByBelongedUniqId', async () => {
    const res = await ctx.service.group.queryGroupByBelongedUniqId({
      belongedUniqId: projectUniqId,
      groupType: 'Interface',
    });
    assert(res.length === 2);
    assert(res[0] instanceof ctx.model.Group);
    assert(res[1] instanceof ctx.model.Group);
    assert(res[0].groupName === 'group1');
    assert(res[0].groupType === 'Interface');
    assert(res[0].belongedUniqId === projectUniqId);
    assert(res[1].groupName === 'group2');
    assert(res[1].groupType === 'Interface');
    assert(res[1].belongedUniqId === projectUniqId);
  });

  it('createGroup', async () => {
    let res = await ctx.service.group.createGroup({
      groupName: 'group1',
      groupType: 'Interface',
      belongedUniqId: projectUniqId,
    });
    const uniqId = res.uniqId;
    res = await ctx.model.Group.findOne({
      where: {
        uniqId,
      },
    });
    assert(res.groupName === 'group1');
    assert(res.groupType === 'Interface');
    assert(res.belongedUniqId === projectUniqId);
    assert(res instanceof ctx.model.Group);
  });

  it('updateGroupName', async () => {
    let res = await ctx.service.group.queryGroupByBelongedUniqId({
      belongedUniqId: projectUniqId,
      groupType: 'Interface',
    });
    const uniqId = res[0].uniqId;
    await ctx.service.group.updateGroupName({
      uniqId,
      groupName: 'group3',
    });
    res = await ctx.model.Group.findOne({
      where: {
        uniqId,
      },
    });
    assert(res.groupName === 'group3');
    assert(res instanceof ctx.model.Group);
  });

  it('deleteGroupByUniqId', async () => {
    let res = await ctx.service.group.queryGroupByBelongedUniqId({
      belongedUniqId: projectUniqId,
      groupType: 'Interface',
    });
    const uniqId = res[0].uniqId;
    await ctx.service.group.deleteGroupByUniqId({ uniqId });
    res = await ctx.model.Group.findAll();
    assert(res.length === 1);
    assert(res[0].groupName === 'group2');
    assert(res[0].groupType === 'Interface');
    assert(res[0] instanceof ctx.model.Group);
  });
});
