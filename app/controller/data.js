'use strict';

const Controller = require('egg').Controller;

class SceneController extends Controller {

  async index() {
    const ctx = this.ctx;
    const params = ctx.params;
    const projectName = params.projectName;
    const pathname = params.pathname;
    const method = ctx.method;

    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({ projectName });
    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    if (!interfaceData) {
      this.fail(`${method} ${pathname} not found`);
      return;
    }

    const res = await ctx.service.scene.querySceneByUniqId({
      uniqId: interfaceData.currentScene,
    });

    res ?
      ctx.body = res.data :
      this.fail(`${method} ${pathname} '${interfaceData.currentScene}' scene not found`);
  }

  fail(message) {
    const ctx = this.ctx;
    ctx.set('x-datahub-fail', message);
    ctx.status = 400;
    ctx.body = {};
  }
}

module.exports = SceneController;
