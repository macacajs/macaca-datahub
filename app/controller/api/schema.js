'use strict';

const Controller = require('egg').Controller;

class SchemaController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const res = await ctx.service.schema.querySchemaByInterfaceUniqId();
    ctx.body = res;
  }

  async show() {
    const ctx = this.ctx;
    const res = await ctx.service.schema.querySchemaByUniqId();
    ctx.body = res;
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.schema.createSchema();
    ctx.body = res;
  }

  async update() {
    const ctx = this.ctx;
    const res = await ctx.service.schema.updateSchema();
    ctx.body = res;
  }

  async delete() {
    const ctx = this.ctx;
    const res = await ctx.service.schema.deleteSchemaByUniqId();
    ctx.body = res;
  }
}

module.exports = SchemaController;
