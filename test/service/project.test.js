'use strict';

const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/project.test.js', () => {
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
    const defaultInterfaceGroup = await ctx.model.Group.findOne({
      where: {
        belongedUniqId: res.uniqId,
        groupType: 'Interface',
      }
    });
    assert(defaultInterfaceGroup.groupName === 'default_group');
    assert(defaultInterfaceGroup.groupType === 'Interface');
    assert(defaultInterfaceGroup instanceof ctx.model.Group);
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
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'qwer', description: 'qwert', globaProxy: 'http://127.0.0.1' },
    ]);
    const [{ uniqId: interfaceGroupUniqId }] = await ctx.model.Group.bulkCreate([
      { belongedUniqId: projectUniqId, groupName: 'interfaceGroup1', groupType: 'Interface' }
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description', groupUniqId: interfaceGroupUniqId },
    ]);
    await ctx.service.scene.createScene({
      interfaceUniqId,
      sceneName: 'default',
      data: { id: 'default' },
    });
    let res = await ctx.service.project.queryAllProject();
    const uniqId = res[2].uniqId;
    await ctx.service.project.deleteProjectByUniqId({ uniqId });
    res = await ctx.model.Project.findAll();
    const interfaceGroups = await ctx.model.Group.findAll({
      where: {
        belongedUniqId: uniqId,
        groupType: 'Interface',
      },
    });
    const interfaces = await ctx.model.Interface.findAll({
      where: {
        projectUniqId: uniqId,
      },
    });
    const scenes = await ctx.model.Scene.findAll({
      where: {
        interfaceUniqId,
      },
    });
    assert(interfaceGroups.length === 0);
    assert(interfaces.length === 0);
    assert(scenes.length === 0);
    assert(res.length === 2);
    assert(res[0].projectName === 'baz');
    assert(res[0].description === 'bazd');
    assert(res[0] instanceof ctx.model.Project);
    assert(res[1].projectName === 'qux');
    assert(res[1].description === 'quxd');
    assert(res[1] instanceof ctx.model.Project);
  });
});
