'use strict';

const Controller = require('egg').Controller;

class SceneController extends Controller {

  async index() {
    const ctx = this.ctx;
    const params = ctx.params;
    const projectName = params.projectName;
    const pathname = params.pathname;
    const method = ctx.method;

    const { projectUniqId } = await ctx.service.project.queryProjectByName(projectName);

    const res = await ctx.service.scene.queryScene({
      projectUniqId,
      pathname,
      method,
    });
    ctx.body = res;
  }
}

module.exports = SceneController;
