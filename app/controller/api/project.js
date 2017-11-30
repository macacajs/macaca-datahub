'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  async query(ctx) {
    const res = await ctx.service.project.query();
    this.ctx.body = res;
  }

  async upsert(ctx) {
    const body = ctx.request.body;
    const identifer = body.identifer;

    const res = await ctx.service.project.upsertById(identifer, body);

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
    await ctx.service.data.removeByProjectId(identifer);
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
