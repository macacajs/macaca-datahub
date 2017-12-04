'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');
const Service = require('egg').Service;

class ProjectService extends Service {

  async query() {
    return await this.ctx.model.Project.findAll({
      raw: true,
    });
  }

  async queryById(projectId) {
    return await this.ctx.model.Project.findAll({
      where: {
        identifer: projectId,
      },
      raw: true,
    });
  }

  async upsertById(identifer, data) {
    await this.ctx.model.Project.upsert({
      ...data,
    }, {
      where: {
        identifer,
      },
    });
    return await this.asyncMigration();
  }

  async removeById(identifer) {
    await this.ctx.model.Project.destroy({
      where: {
        identifer,
      },
    });
    return await this.asyncMigration();
  }

  async asyncMigration() {
    const res = await this.ctx.model.Project.findAll({
      raw: true,
    });

    if (this.ctx.app.config.dataHubStoreDir) {
      _.mkdir(this.ctx.app.config.dataHubStoreDir);
      const distRes = res.map(item => {
        delete item.id;
        delete item.created_at;
        delete item.updated_at;
        return item;
      });
      fs.writeFile(path.resolve(this.ctx.app.config.dataHubStoreDir, 'hub.data'), JSON.stringify(distRes, null, 2));
    }
    return res;
  }
}

module.exports = ProjectService;

