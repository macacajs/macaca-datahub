'use strict';

const Service = require('egg').Service;

class SchemaService extends Service {

  async querySchemaByProjectUniqId() {
    return await this.ctx.model.Schema.findAll();
  }

  async querySchema() {
    return await this.ctx.model.Schema.findAll();
  }

  async querySchemaByUniqId() {
    return await this.ctx.model.Schema.findAll();
  }

  async createSchema() {
    return await this.ctx.model.Schema.findAll();
  }

  async updateSchema() {
    return await this.ctx.model.Schema.findAll();
  }

  async deleteSchemaByUniqId() {
    return await this.ctx.model.Schema.findAll();
  }
}

module.exports = SchemaService;

