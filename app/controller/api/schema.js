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
    const { interfaceUniqId } = ctx.request.body;
    ctx.assertParam({ interfaceUniqId });
    const payload = {};
    for (const key of [
      'enableSchemaValidate',
      'schemaData'
    ]) {
      if (typeof ctx.request.body[key] !== 'undefined') {
        payload[key] = ctx.request.body[key];
      }
    }
    const res = await ctx.service.schema.updateSchema({
      interfaceUniqId, type, payload,
    });
    ctx.success(res);
  }
}

module.exports = SchemaController;
