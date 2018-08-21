'use strict';

const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/project.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
    await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
      { projectName: 'qux', description: 'quxd' },
    ]);
  });

  it('queryAllProject', async () => {
    const res = await ctx.service.project.queryAllProject();
    assert(res.length === 2);
    assert(res[0] instanceof ctx.model.Project);
    assert(res[1] instanceof ctx.model.Project);
    assert(res[0].projectName === 'baz');
    assert(res[0].description === 'bazd');
    assert(res[1].projectName === 'qux');
    assert(res[1].description === 'quxd');
  });

  it('queryProjectByName', async () => {
    const res = await ctx.service.project.queryProjectByName({ projectName: 'baz' });
    assert(res.projectName === 'baz');
    assert(res.description === 'bazd');
    assert(res instanceof ctx.model.Project);
  });

  it('queryProjectByUniqId', async () => {
    let res = await ctx.service.project.queryAllProject();
    const uniqId = res[0].uniqId;
    res = await ctx.service.project.queryProjectByUniqId({ uniqId });
    assert(res.projectName === 'baz');
    assert(res.description === 'bazd');
    assert(res instanceof ctx.model.Project);
  });

  it('createProject', async () => {
    let res = await ctx.service.project.createProject({
      projectName: 'cprojectName',
      description: 'cdescription',
    });
    const uniqId = res.uniqId;
    res = await ctx.model.Project.findOne({
      where: {
        uniqId,
      },
    });
    assert(res.projectName === 'cprojectName');
    assert(res.description === 'cdescription');
    assert(res instanceof ctx.model.Project);
  });

  it('updateProject', async () => {
    let res = await ctx.service.project.queryAllProject();
    const uniqId = res[0].uniqId;
    await ctx.service.project.updateProject({
      uniqId,
      payload: {
        projectName: 'uprojectName',
      },
    });
    res = await ctx.model.Project.findOne({
      where: {
        uniqId,
      },
    });
    assert(res.projectName === 'uprojectName');
    assert(res.description === 'bazd');
    assert(res instanceof ctx.model.Project);
  });

  it('deleteProjectByUniqId', async () => {
    let res = await ctx.service.project.queryAllProject();
    const uniqId = res[0].uniqId;
    await ctx.service.project.deleteProjectByUniqId({ uniqId });
    res = await ctx.model.Project.findAll();
    assert(res.length === 1);
    assert(res[0].projectName === 'qux');
    assert(res[0].description === 'quxd');
    assert(res[0] instanceof ctx.model.Project);
  });
});
