'use strict';

const Service = require('egg').Service;

class InterfaceService extends Service {

  async queryInterfaceByProjectUniqId({ projectUniqId }) {
    return await this.ctx.model.Interface.findAll({
      where: {
        projectUniqId,
      },
    });
  }

  async queryInterfaceByUniqId({ uniqId }) {
    return await this.ctx.model.Interface.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createInterface() {
    return await this.ctx.model.Interface.findAll();
  }

  async updateInterface() {
    return await this.ctx.model.Interface.findAll();
  }

  async deleteInterfaceByUniqId() {
    return await this.ctx.model.Interface.findAll();
  }
}

module.exports = InterfaceService;

