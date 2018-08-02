'use strict';

const fs = require('mz/fs');
const path = require('path');
const Service = require('egg').Service;

class DataBaseService extends Service {
  constructor(ctx) {
    super(ctx);
    this.excludeAttributes = ctx.app.config.exportExcludeAttributes;
    this.baseDir = ctx.app.config.exportArchiveBaseDir;
  }

  async importData() {
    const ctx = this.ctx;
    if (!ctx.app.config.exportArchiveBaseDir) return;
    await this.ensureDir(this.baseDir);
    const baseDir = ctx.app.config.exportArchiveBaseDir;
    const contents = await fs.readdir(baseDir);
    await contents.map(content => {
      return (async () => {
        const constentPath = path.join(baseDir, content);
        const stat = await fs.stat(constentPath);
        if (stat.isFile() && content.endsWith('.json')) {
          await this.importProject(constentPath);
        }
        if (stat.isDirectory()) {
          await this.importProjectRelated(constentPath);
        }
      })();
    });
  }

  async importProject(contentPath) {
    const buffer = await fs.readFile(contentPath);
    const data = JSON.parse(buffer);
    await this.ctx.model.Project.upsert(data);
  }

  async importProjectRelated(baseDir) {
    const contents = await fs.readdir(baseDir);
    await contents.map(content => {
      return (async () => {
        const constentPath = path.join(baseDir, content);
        const stat = await fs.stat(constentPath);
        if (stat.isFile()) {
          await this.importInterface(constentPath);
        }
        if (stat.isDirectory()) {
          await this.importScene(path.join(constentPath, 'scene'));
          await this.importSchema(path.join(constentPath, 'schema'));
        }
      })();
    });
  }

  async importInterface(contentPath) {
    const buffer = await fs.readFile(contentPath);
    const data = JSON.parse(buffer);
    await this.ctx.model.Interface.upsert(data);
  }

  async importScene(baseDir) {
    if (!fs.existsSync(baseDir)) return;
    const contents = await fs.readdir(baseDir);
    await contents.map(content => {
      return (async () => {
        const buffer = await fs.readFile(path.join(baseDir, content));
        const data = JSON.parse(buffer);
        await this.ctx.model.Scene.upsert(data);
      })();
    });
  }

  async importSchema(baseDir) {
    if (!fs.existsSync(baseDir)) return;
    const contents = await fs.readdir(baseDir);
    await contents.map(content => {
      return (async () => {
        const buffer = await fs.readFile(path.join(baseDir, content));
        const data = JSON.parse(buffer);
        await this.ctx.model.Schema.upsert(data);
      })();
    });
  }

  async exportData() {
    if (!this.ctx.app.config.exportArchiveBaseDir) return;
    await this.ensureDir(this.baseDir);
    const projects = await this.ctx.service.project.queryAllProject({
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(projects.map(project => {
      return this.exportProject(project);
    }));
  }

  async ensureDir(dir) {
    if (fs.existsSync(dir)) return;
    await fs.mkdir(dir);
  }

  async exportProject(project) {
    await fs.writeFile(
      path.join(this.baseDir, `${project.projectName}.json`),
      JSON.stringify(project, null, 2)
    );
    await this.ensureDir(path.join(this.baseDir, project.projectName));
    const interfaces = await this.ctx.service.interface.queryInterfaceByProjectUniqId({
      projectUniqId: project.uniqId,
    }, {
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(interfaces.map(interfaceData => {
      return this.exportInterface(interfaceData, project.projectName);
    }));
  }

  async exportInterface(interfaceData, projectName) {
    const exportInterfaceName = `${projectName}_${interfaceData.method}_` +
    `${interfaceData.pathname.replace(/[:/]/g, '#')}`;
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceName));
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceName, 'scene'));
    await this.ensureDir(path.join(this.baseDir, projectName, exportInterfaceName, 'schema'));
    await fs.writeFile(
      path.join(this.baseDir, projectName, `${exportInterfaceName}.json`),
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
        return this.exportScene(scene, projectName, exportInterfaceName);
      }).concat(schemas.map(schema => {
        return this.exportSchema(schema, projectName, exportInterfaceName);
      })));
  }

  async exportScene(scene, projectName, exportInterfaceName) {
    await fs.writeFile(
      path.join(
        this.baseDir,
        projectName,
        exportInterfaceName,
        'scene',
        `${scene.sceneName}.json`
      ),
      JSON.stringify(scene, null, 2)
    );
  }

  async exportSchema(schema, projectName, exportInterfaceName) {
    await fs.writeFile(
      path.join(
        this.baseDir,
        projectName,
        exportInterfaceName,
        'schema',
        `${schema.type}.json`
      ),
      JSON.stringify(schema, null, 2)
    );
  }
}

module.exports = DataBaseService;
