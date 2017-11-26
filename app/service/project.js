'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;

class ProjectService extends Service {

  async query() {
    return await this.ctx.app.ProjectModel.findAll({
      raw: true,
    });
  }

  async queryById(projectId) {
    return await this.ctx.app.ProjectModel.findAll({
      where: {
        identifer: projectId,
      },
      raw: true,
    });
  }

  async upsertById(identifer, data) {
    await this.ctx.app.ProjectModel.upsert({
      ...data,
    }, {
      where: {
        identifer,
      },
    });
    return await this.asyncMigration();
  }

  async removeById(identifer) {
    await this.ctx.app.ProjectModel.destroy({
      where: {
        identifer,
      },
    });
    return await this.asyncMigration();
  }

  async asyncMigration() {
    const res = await this.ctx.app.ProjectModel.findAll({
      raw: true,
    });
    if (this.ctx.app.config.dataHubStoreDir) {
      const distRes = res.map(item => {
        delete item.id;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
      });
      fs.writeFile(path.resolve(this.ctx.app.config.dataHubStoreDir, 'hub.data'), JSON.stringify(distRes, null, 2));
    }
    return res;
  }
}

module.exports = ProjectService;

