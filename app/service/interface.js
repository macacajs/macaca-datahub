'use strict';

const Service = require('egg').Service;

class InterfaceService extends Service {

  async queryInterfaceByProjectUniqId() {
    return await this.ctx.model.Interface.findAll();
  }

  async queryInterfaceByUniqId() {
    return await this.ctx.model.Interface.findAll();
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

