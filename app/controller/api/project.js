'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const res = await ctx.service.project.queryAllProject({ raw: true });
    for (const item of res) {
      const iterfaceList = await ctx.service.interface.queryInterfaceByProjectUniqId({
        projectUniqId: item.uniqId,
      });
      item.capacity = {
        count: iterfaceList.length,
        size: iterfaceList.length, // TODO calculate size
      };
    }
    ctx.success(res);
  }

  async show() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.project.queryProjectByUniqId({ uniqId });
    ctx.success(res);
  }

  async create() {
    const ctx = this.ctx;
    const {
      projectName,
      description,
    } = ctx.request.body;
    ctx.assertParam({ projectName, description });
    const res = await ctx.service.project.createProject({
      projectName,
      description,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const payload = {};
    [ 'description', 'projectName' ].forEach(i => {
      if (ctx.request.body[i]) payload[i] = ctx.request.body[i];
    });
    const res = await ctx.service.project.updateProject({
      uniqId,
      payload,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.project.deleteProjectByUniqId({ uniqId });
    ctx.success(res);
  }
}

module.exports = ProjectController;
