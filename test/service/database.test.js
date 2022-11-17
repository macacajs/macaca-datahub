'use strict';

const { assert, app } = require('egg-mock/bootstrap');
const rimraf = require('rimraf');
const path = require('path');
const { fs } = require('mz');

describe('test/app/service/database.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
    ctx.app.config.exportArchiveBaseDir = path.join(__dirname, '..', 'fixtures', 'unittest_data');
  });

  it('importData: no archive dir', async () => {
    ctx.app.config.exportArchiveBaseDir = null;
    await ctx.service.database.importData();
    const projectData = await ctx.model.Project.findAll();
    assert(projectData.length === 0);
  });

  it('importData', async () => {
    await ctx.service.database.importData();
    const projectData = await ctx.model.Project.findAll();
    assert(projectData.length === 2);
    assert(projectData[0] instanceof ctx.model.Project);
    assert(projectData[1] instanceof ctx.model.Project);
  });

  it('import new data', async () => {
    ctx.app.config.exportArchiveBaseDir = path.join(__dirname, '..', 'fixtures', 'unittest_new_data');
    await ctx.service.database.importData();
    const projectData = await ctx.model.Project.findAll();
    assert(projectData.length === 1);
    assert(projectData[0] instanceof ctx.model.Project);
  });

  it('exportData: no archive dir', async () => {
    ctx.app.config.exportArchiveBaseDir = null;
    await ctx.model.Project.create({
      projectName: 'export one',
      description: 'project export one',
    });
    await ctx.service.database.exportData();
  });

  it('exportData', async () => {
    const exportDir = path.join(__dirname, '..', 'fixtures', 'unittest_export_data');
    rimraf.sync(exportDir);
    ctx.app.config.exportArchiveBaseDir = exportDir;
    const { uniqId: projectUniqId } = await ctx.model.Project.create({
      projectName: 'one',
      description: 'project export one',
    });
    const { uniqId: groupUniqId } = await ctx.model.Group.create({
      groupName: 'api/v2',
      groupType: 'Interface',
      belongedUniqId: projectUniqId,
    });
    const { uniqId: groupUniqId1 } = await ctx.model.Group.create({
      groupName: 'api/web',
      groupType: 'Interface',
      belongedUniqId: projectUniqId,
    });
    const { uniqId: interfaceUniqId } = await ctx.model.Interface.create({
      projectUniqId,
      groupUniqId,
      pathname: 'one',
      description: 'interface one',
    });
    await ctx.model.Interface.create({
      projectUniqId,
      groupUniqId: groupUniqId1,
      pathname: 'one',
      description: 'interface one',
    });
    await ctx.model.Scene.create({
      interfaceUniqId,
      sceneName: 'default',
      data: {
        id: 'default',
      },
    });
    await ctx.model.Schema.create({
      interfaceUniqId,
      type: 'request',
      data: {
        schemaData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '',
            },
          },
          required: [],
        },
        enableSchemaValidate: true,
      },
    });
    await ctx.service.database.exportData();
    const isFile = async statPath => (await fs.stat(path.join(exportDir, ...statPath))).isFile();
    const isDir = async statPath => (await fs.stat(path.join(exportDir, ...statPath))).isDirectory();
    assert(await isDir([ 'one' ]));
    assert(await isDir([ 'one', 'api#v2.group' ]));
    assert(await isDir([ 'one', 'api#v2.group', 'GET_one' ]));
    assert(await isDir([ 'one', 'api#v2.group', 'GET_one', 'scene' ]));
    assert(await isDir([ 'one', 'api#v2.group', 'GET_one', 'schema' ]));
    assert(await isFile([ 'one.json' ]));
    assert(await isFile([ 'one', 'api#v2.group.json' ]));
    assert(await isFile([ 'one', 'api#v2.group', 'GET_one.json' ]));
    assert(await isFile([ 'one', 'api#v2.group', 'GET_one', 'scene', 'default.json' ]));
    assert(await isFile([ 'one', 'api#v2.group', 'GET_one', 'schema', 'request.json' ]));

    const projectContent = JSON.parse(await fs.readFile(path.join(exportDir, 'one.json'), 'utf8'));
    assert(projectContent.projectName === 'one');
    assert(projectContent.description === 'project export one');
    assert(projectContent.uniqId);

    const sceneContent = JSON.parse(await fs.readFile(path.join(exportDir, 'one', 'api#v2.group', 'GET_one', 'scene', 'default.json'), 'utf8'));
    assert(sceneContent.sceneName === 'default');
    assert.deepStrictEqual(sceneContent.data, {
      id: 'default',
    });
    assert(sceneContent.interfaceUniqId === interfaceUniqId);
    assert(sceneContent.uniqId);

    const schemaContent = JSON.parse(await fs.readFile(path.join(exportDir, 'one', 'api#v2.group', 'GET_one', 'schema', 'request.json'), 'utf8'));
    assert(schemaContent.type === 'request');
    assert.deepStrictEqual(schemaContent.data, {
      schemaData: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '',
          },
        },
        required: [],
      },
      enableSchemaValidate: true,
    });
    assert(schemaContent.interfaceUniqId === interfaceUniqId);
    assert(schemaContent.uniqId);

    // export twice
    await ctx.service.database.exportData();
    assert(await isDir([ 'one' ]));
    assert(await isDir([ 'one', 'api#v2.group' ]));
    assert(await isDir([ 'one', 'api#v2.group', 'GET_one' ]));
    assert(await isDir([ 'one', 'api#v2.group', 'GET_one', 'scene' ]));
    assert(await isDir([ 'one', 'api#v2.group', 'GET_one', 'schema' ]));

    assert(await isFile([ 'one.json' ]));
    assert(await isFile([ 'one', 'api#v2.group.json' ]));
    assert(await isFile([ 'one', 'api#v2.group', 'GET_one.json' ]));
    assert(await isFile([ 'one', 'api#v2.group', 'GET_one', 'scene', 'default.json' ]));
    assert(await isFile([ 'one', 'api#v2.group', 'GET_one', 'schema', 'request.json' ]));
    // rimraf.sync(exportDir);
  });
});
