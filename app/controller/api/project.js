'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  async query(ctx) {
    const res = await ctx.service.project.query();
    this.ctx.body = res;
  }

  async upsert(ctx) {
    const body = ctx.request.body;
    const isExist = await ctx.service.project.queryById(body.identifer);
    let res = null;
    if (isExist.length > 0) {
      res = await ctx.service.project.updateById(body);
    } else {
      res = await ctx.service.project.add(body);
    }
    if (res) {
      this.ctx.body = {
        success: true,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }

  async remove(ctx) {
    const body = ctx.request.body;
    const identifer = body.identifer;
    const res = await ctx.service.project.removeById(identifer);

    if (res) {
      this.ctx.body = {
        success: true,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }
}

module.exports = ProjectController;
