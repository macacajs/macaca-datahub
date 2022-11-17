'use strict';

const fs = require('mz/fs');
const path = require('path');
const rimraf = require('rimraf');
const Service = require('egg').Service;

class DataBaseService extends Service {
  constructor(ctx) {
    super(ctx);
    this.excludeAttributes = ctx.app.config.exportExcludeAttributes;
    this.baseDir = ctx.app.config.exportArchiveBaseDir;
  }

  async ensureDir(dir) {
    if (fs.existsSync(dir)) return;
    await fs.mkdir(dir);
  }

  async ensureNewDir(dir) {
    if (fs.existsSync(dir)) rimraf.sync(dir);

    // support Docker volume data
    if (!fs.existsSync(dir)) {
      await fs.mkdir(dir);
    }
  }

  async importData() {
    const ctx = this.ctx;
    if (!ctx.app.config.exportArchiveBaseDir) return;
    await this.ensureDir(this.baseDir);
    const baseDir = ctx.app.config.exportArchiveBaseDir;
    const contents = await fs.readdir(baseDir);
    await Promise.all(contents.map(async content => {
      const constentPath = path.join(baseDir, content);
      const stat = await fs.stat(constentPath);
      if (stat.isFile() && content.endsWith('.json')) {
        await this.importProject(constentPath);
      }
      if (stat.isDirectory()) {
        await this.importProjectRelated(constentPath);
      }
    }));
  }

  async importProject(contentPath) {
    const buffer = await fs.readFile(contentPath);
    const data = JSON.parse(buffer);
    await this.ctx.model.Project.upsert(data);
  }

  async importProjectRelated(baseDir) {
    const contents = await fs.readdir(baseDir);
    await Promise.all(contents.map(async content => {
      const constentPath = path.join(baseDir, content);
      const stat = await fs.stat(constentPath);
      if (stat.isFile()) {
        // 兼容存量数据，新导出的 group 目录会以 .group 结尾
        if (content.endsWith('.group.json')) {
          await this.importInterfaceGroup(constentPath);
        } else {
          await this.importInterface(constentPath);
        }
      }
      if (stat.isDirectory()) {
        // 兼容存量数据，新导出的 group 目录会以 .group 结尾
        if (content.endsWith('.group')) {
          await this.importInterfaceGroupRelated(constentPath);
        } else {
          await this.importScene(path.join(constentPath, 'scene'));
          await this.importSchema(path.join(constentPath, 'schema'));
        }
      }
    }));
  }

  async importInterfaceGroup(contentPath) {
    const buffer = await fs.readFile(contentPath);
    const data = JSON.parse(buffer);
    await this.ctx.model.Group.upsert(data);
  }

  async importInterfaceGroupRelated(baseDir) {
    const contents = await fs.readdir(baseDir);
    await Promise.all(contents.map(async content => {
      const constentPath = path.join(baseDir, content);
      const stat = await fs.stat(constentPath);
      if (stat.isFile()) {
        await this.importInterface(constentPath);
      }
      if (stat.isDirectory()) {
        await this.importScene(path.join(constentPath, 'scene'));
        await this.importSchema(path.join(constentPath, 'schema'));
      }
    }));
  }

  async importInterface(contentPath) {
    const buffer = await fs.readFile(contentPath);
    const data = JSON.parse(buffer);
    await this.ctx.model.Interface.upsert(data);
  }

  async importScene(baseDir) {
    if (!fs.existsSync(baseDir)) return;
    const contents = await fs.readdir(baseDir);
    await Promise.all(contents.map(async content => {
      const buffer = await fs.readFile(path.join(baseDir, content));
      const data = JSON.parse(buffer);
      await this.ctx.model.Scene.upsert(data);
    }));
  }

  async importSchema(baseDir) {
    if (!fs.existsSync(baseDir)) return;
    const contents = await fs.readdir(baseDir);
    await Promise.all(contents.map(async content => {
      const buffer = await fs.readFile(path.join(baseDir, content));
      const data = JSON.parse(buffer);
      await this.ctx.model.Schema.upsert(data);
    }));
  }

  async exportData() {
    if (!this.ctx.app.config.exportArchiveBaseDir) return;
    await this.ensureNewDir(this.baseDir);
    const projects = await this.ctx.service.project.queryAllProject({
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(projects.map(project => {
      return this.exportProject(project);
    }));
  }

  async exportProject(project) {
    await fs.writeFile(
      path.join(this.baseDir, `${project.projectName}.json`),
      JSON.stringify(project, null, 2)
    );
    await this.ensureDir(path.join(this.baseDir, project.projectName));
    const interfaceGroups = await this.ctx.service.group.queryGroupByBelongedUniqId({
      belongedUniqId: project.uniqId,
      groupType: 'Interface',
    }, {
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(interfaceGroups.map(groupData => {
      return this.exportInterfaceGroup(groupData, project.projectName);
    }));
  }

  async exportInterfaceGroup(groupData, projectName) {
    const exportInterfaceGroupName = `${groupData.groupName.replace(/[:/]/g, '#')}.group`;
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceGroupName));
    await fs.writeFile(
      path.join(this.baseDir, projectName, `${exportInterfaceGroupName}.json`),
      JSON.stringify(groupData, null, 2)
    );

    const interfaces = await this.ctx.service.interface.queryInterfaceByGroupUniqId({
      groupUniqId: groupData.uniqId,
    }, {
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(interfaces.map(interfaceData => {
      return this.exportInterface(interfaceData, projectName, exportInterfaceGroupName);
    }));
  }

  async exportInterface(interfaceData, projectName, exportInterfaceGroupName) {
    const exportInterfaceName = `${interfaceData.method}_${interfaceData.pathname.replace(/[:/]/g, '#')}`;
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceGroupName, exportInterfaceName));
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceGroupName, exportInterfaceName, 'scene'));
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceGroupName, exportInterfaceName, 'schema'));
    await fs.writeFile(
      path.join(this.baseDir, projectName, exportInterfaceGroupName, `${exportInterfaceName}.json`),
      JSON.stringify(interfaceData, null, 2)
    );
    const scenes = await this.ctx.service.scene.querySceneByInterfaceUniqId({
      interfaceUniqId: interfaceData.uniqId,
    }, {
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    const schemas = await this.ctx.service.schema.querySchemaByInterfaceUniqId({
      interfaceUniqId: interfaceData.uniqId,
    }, {
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(
      scenes.map(scene => {
        return this.exportScene(scene, projectName, exportInterfaceGroupName, exportInterfaceName);
      }).concat(schemas.map(schema => {
        return this.exportSchema(schema, projectName, exportInterfaceGroupName, exportInterfaceName);
      })));
  }

  async exportScene(scene, projectName, exportInterfaceGroupName, exportInterfaceName) {
    await fs.writeFile(
      path.join(
        this.baseDir,
        projectName,
        exportInterfaceGroupName,
        exportInterfaceName,
        'scene',
        `${scene.sceneName}.json`
      ),
      JSON.stringify(scene, null, 2)
    );
  }

  async exportSchema(schema, projectName, exportInterfaceGroupName, exportInterfaceName) {
    await fs.writeFile(
      path.join(
        this.baseDir,
        projectName,
        exportInterfaceGroupName,
        exportInterfaceName,
        'schema',
        `${schema.type}.json`
      ),
      JSON.stringify(schema, null, 2)
    );
  }
}

module.exports = DataBaseService;
