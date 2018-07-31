'use strict';

const Controller = require('egg').Controller;
class SchemaController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const { interfaceUniqId } = ctx.query;
    ctx.assertParam({ interfaceUniqId });
    const res = await ctx.service.schema.querySchemaByInterfaceUniqId({ interfaceUniqId });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const { type } = ctx.params;
    const { interfaceUniqId, data } = ctx.request.body;
    ctx.assertParam({ interfaceUniqId, data });
    const res = await ctx.service.schema.updateSchema({
      interfaceUniqId, type, data,
    });
    ctx.success(res);
  }
}

module.exports = SchemaController;
