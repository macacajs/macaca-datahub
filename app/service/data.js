'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;

class DataService extends Service {

  async queryByProjectId(projectId) {
    return await this.ctx.app.DataModel.findAll({
      where: {
        identifer: projectId,
      },
      raw: true,
    });
  }

  async getByProjectIdAndDataId(projectId, dataId) {
    return await this.ctx.app.DataModel.findOne({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
      raw: true,
    });
  }

  async addByProjectId(projectId, data) {
    await this.ctx.app.DataModel.create({
      identifer: projectId,
      pathname: data.pathname,
      description: data.description,
    });
    return await this.asyncMigration();
  }

  async updateByProjectIdAndDataId(projectId, dataId, data) {
    await this.ctx.app.DataModel.update({
      ...data,
    }, {
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
    return await this.asyncMigration();
  }

  async removeByProjectIdAndDataId(projectId, dataId) {
    await this.ctx.app.DataModel.destroy({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
    return await this.asyncMigration();
  }

  async asyncMigration() {
    const res = await this.ctx.app.DataModel.findAll({
      raw: true,
    });
    if (this.ctx.app.config.dataHubStoreDir) {
      const distRes = res.map(item => {
        delete item.id;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
      });
      fs.writeFile(path.resolve(this.ctx.app.config.dataHubStoreDir, 'archive.data'), JSON.stringify(distRes, null, 2));
    }
    return res;
  }
}

module.exports = DataService;
