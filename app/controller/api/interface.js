'use strict';

const Controller = require('egg').Controller;

class InterfaceController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.queryInterfaceByProjectUniqId();
    ctx.body = res;
  }

  async show() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.queryInterfaceByUniqId();
    ctx.body = res;
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.createInterface();
    ctx.body = res;
  }

  async update() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.updateInterface();
    ctx.body = res;
  }

  async delete() {
    const ctx = this.ctx;
    const res = await ctx.service.interface.deleteInterfaceByUniqId();
    ctx.body = res;
  }
}

module.exports = InterfaceController;
