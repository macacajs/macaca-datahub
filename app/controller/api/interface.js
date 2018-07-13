'use strict';

const Controller = require('egg').Controller;

class InterfaceController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const { projectUniqId } = ctx.query;
    ctx.assertParam({ projectUniqId });
    const res = await ctx.service.interface.queryInterfaceByProjectUniqId({ projectUniqId });
    ctx.success(res);
  }

  async show() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.queryInterfaceByUniqId();
    ctx.success(res);
  }

  async create() {
    const ctx = this.ctx;
    const { projectUniqId, pathname, method, description } = ctx.request.body;
    ctx.assertParam({ projectUniqId, pathname, method, description });
    const res = await ctx.service.interface.createInterface({
      projectUniqId, pathname, method, description,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.updateInterface();
    ctx.body = res;
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.interface.deleteInterfaceByUniqId({ uniqId });
    if (res) {
      ctx.success(res);
      return;
    }
    ctx.fail(ctx.gettext('common.delete.fail'));
  }
}

module.exports = InterfaceController;
