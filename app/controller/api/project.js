'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const res = await ctx.service.project.queryAllProject();
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
    const { description, projectName } = ctx.request.body;
    const payload = {};
    if (description) payload.description = description;
    if (projectName) payload.projectName = projectName;
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
