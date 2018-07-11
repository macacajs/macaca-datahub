'use strict';

const Service = require('egg').Service;

class ApiService extends Service {

  async queryApiByProjectUniqId() {
    return await this.ctx.model.Api.findAll();
  }

  async queryApi() {
    return await this.ctx.model.Api.findAll();
  }

  async queryApiByUniqId() {
    return await this.ctx.model.Api.findAll();
  }

  async createApi() {
    return await this.ctx.model.Api.findAll();
  }

  async updateApi() {
    return await this.ctx.model.Api.findAll();
  }

  async deleteApiByUniqId() {
    return await this.ctx.model.Api.findAll();
  }
}

module.exports = ApiService;

