'use strict';

const {
  Service,
} = require('egg');
const _ = require('xutil');
const fs = require('mz/fs');
const path = require('path');

class DataService extends Service {

  async queryByProjectId(projectId) {
    return await this.ctx.model.Data.findAll({
      where: {
        identifer: projectId,
      },
      raw: true,
    });
  }

  async getByProjectIdAndDataId(projectId, dataId) {
    return await this.ctx.model.Data.findOne({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
      raw: true,
    });
  }

  async addByProjectId(projectId, data) {
    await this.ctx.model.Data.create({
      identifer: projectId,
      pathname: data.pathname,
      description: data.description,
    });
    return await this.asyncMigration();
  }

  async updateByProjectIdAndDataId(projectId, dataId, data) {
    await this.ctx.model.Data.update({
      ...data,
    }, {
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
    return await this.asyncMigration();
  }

  async removeByProjectId(projectId) {
    await this.ctx.model.Data.destroy({
      where: {
        identifer: projectId,
      },
    });
    return await this.asyncMigration();
  }

  async removeByProjectIdAndDataId(projectId, dataId) {
    await this.ctx.model.Data.destroy({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
    return await this.asyncMigration();
  }

  async asyncMigration() {
    const res = await this.ctx.model.Data.findAll({
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

      const archivePath = path.resolve(this.ctx.app.config.dataHubStoreDir, 'archive.data');
      try {
        await fs.writeFile(archivePath, JSON.stringify(distRes, null, 2));
        this.ctx.logger.info('archive.data saved');
      } catch (err) {
        this.ctx.logger.error('can\'t save archive.data', err);
      }
    }
    return res;
  }
}

module.exports = DataService;
