'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const res = await ctx.service.project.queryAllProject();
    ctx.body = res;
  }

  async show() {
    const ctx = this.ctx;
    const res = await ctx.service.project.queryProjectByUniqId();
    // const res = await ctx.service.project.queryProjectByName();
    ctx.body = res;
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.project.createProject();
    ctx.body = res;
  }

  async update() {
    const ctx = this.ctx;
    const res = await ctx.service.project.updateProject();
    ctx.body = res;
  }

  async delete() {
    const ctx = this.ctx;
    const res = await ctx.service.project.deleteProjectByUniqId();
    ctx.body = res;
  }
}

module.exports = ProjectController;
