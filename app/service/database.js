'use strict';

const fs = require('mz/fs');
const path = require('path');
const Service = require('egg').Service;


class DataBaseService extends Service {
  async importData() {
    const ctx = this.ctx;
    const baseDir = ctx.app.config.exportArchiveBaseDir;
    console.log('import data from', baseDir);
  }

  async exportData() {
    this.baseDir = this.app.config.exportArchiveBaseDir;
    await this.ensureDir(this.baseDir);
    const projects = await this.ctx.service.project.queryAllProject({
      raw: true,
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
      raw: true,
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(interfaces.map(interfaceData => {
      return this.exportInterface(interfaceData, project.projectName);
    }));
  }

  async exportInterface(interfaceData, projectName) {
    const exportInterfaceName = `${interfaceData.method}_` +
    `${interfaceData.pathname.replace(/\//g, '_')}_${interfaceData.uniqId.substr(0, 8)}`;
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
      raw: true,
      attributes: {
        exclude: this.excludeAttributes,
      },
    });
    await Promise.all(scenes.map(scene => {
      return this.exportScene(scene, projectName, exportInterfaceName);
    }));
  }

  async exportScene(scene, projectName, exportInterfaceName) {
    await fs.writeFile(
      path.join(
        this.baseDir,
        projectName,
        exportInterfaceName,
        'scene',
        `${scene.sceneName}.josn`
      ),
      JSON.stringify(scene, null, 2)
    );
  }
}

module.exports = DataBaseService;
