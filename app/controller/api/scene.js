'use strict';

const Controller = require('egg').Controller;

class SceneController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const { interfaceUniqId } = ctx.query;
    ctx.assertParam({ interfaceUniqId });
    const res = await ctx.service.scene.querySceneByInterfaceUniqId({ interfaceUniqId });
    ctx.success(res);
  }

  async show() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.scene.querySceneByUniqId({ uniqId });
    ctx.success(res);
  }

  async create() {
    const ctx = this.ctx;
    const { interfaceUniqId, sceneName, data } = ctx.request.body;
    ctx.assertParam({ interfaceUniqId, sceneName, data });
    const res = await ctx.service.scene.createScene({
      interfaceUniqId, sceneName, data,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const uniqId = ctx.params.uniqId;
    const payload = {};
    [ 'sceneName', 'data' ].forEach(i => {
      if (ctx.request.body[i]) payload[i] = ctx.request.body[i];
    });
    const res = await ctx.service.scene.updateScene({
      uniqId,
      payload,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.scene.deleteSceneByUniqId({ uniqId });
    if (res) {
      ctx.success(res);
      return;
    }
    ctx.fail(ctx.gettext('common.delete.fail'));
  }
}

module.exports = SceneController;
