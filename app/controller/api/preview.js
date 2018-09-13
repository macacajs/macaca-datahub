'use strict';

const Controller = require('egg').Controller;

class PreviewController extends Controller {

  async scene() {
    const ctx = this.ctx;
    const { interfaceUniqId, sceneName } = ctx.query;
    ctx.assertParam({ interfaceUniqId, sceneName });
    const res = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({ interfaceUniqId, sceneName });
    if (!res) {
      ctx.status = 204;
      return;
    }
    ctx.body = res.data;
  }
}

module.exports = PreviewController;
