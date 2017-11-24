'use strict';

const Service = require('egg').Service;

class DataService extends Service {

  async queryByProjectId(projectId) {
    return await this.ctx.app.DataModel.findAll({
      where: {
        identifer: projectId,
      },
    });
  }

  async addByProjectId(projectId, data) {
    return await this.ctx.app.DataModel.create({
      identifer: projectId,
      pathname: data.pathname,
      description: data.description,
    });
  }

  async updateByProjectIdAndDataId(projectId, dataId, data) {
    return await this.ctx.app.DataModel.update({
      ...data,
    }, {
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
  }

  async removeByProjectIdAndDataId(projectId, dataId) {
    return await this.ctx.app.DataModel.destroy({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
  }

  async getByProjectIdAndDataId(projectId, dataId) {
    return await this.ctx.app.DataModel.findOne({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
  }
}

module.exports = DataService;
