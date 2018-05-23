'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');
const Service = require('egg').Service;

class ProjectService extends Service {

  async query() {
    const selector = this.ctx.app.whiteList ? {
      where: {
        [this.app.Sequelize.Op.or]: this.ctx.app.whiteList || [],
      },
      raw: true,
    } : {
      raw: true,
    };
    return await this.ctx.model.Project.findAll(selector);
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
    const projectData = await this.ctx.model.Project.findAll({
      where: {
        identifer,
      },
      raw: true,
    });

    if (!projectData || !projectData.length) { // add Project, upate whiteList
      if (this.ctx.app.whiteList) {
        this.ctx.app.whiteList.push({
          identifer,
        });
      } else {
        this.ctx.app.whiteList = [{
          identifer,
        }];
      }
    }

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
      where: {
        [this.app.Sequelize.Op.or]: this.ctx.app.whiteList || [],
      },
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

