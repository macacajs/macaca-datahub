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
    await ctx.service.interface.updateInterface({
      uniqId: interfaceUniqId,
      payload: {
        currentScene: sceneName,
      },
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const uniqId = ctx.params.uniqId;
    const { interfaceUniqId, ...payload } = ctx.request.body;
    ctx.assertParam({ interfaceUniqId });
    const currentScene = await ctx.service.scene.querySceneByUniqId({ uniqId });
    const currentInterface = await ctx.service.interface.queryInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });
    if (currentInterface.currentScene === currentScene.sceneName) {
      if (payload.sceneName) {
        await ctx.service.interface.updateInterface({
          uniqId: interfaceUniqId,
          payload: {
            currentScene: payload.sceneName,
          },
        });
      }
    }
    const res = await ctx.service.scene.updateScene({
      uniqId,
      payload,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const findScene = await ctx.service.scene.querySceneByUniqId({ uniqId });
    const res = await ctx.service.scene.deleteSceneByUniqId({ uniqId });
    if (findScene && res) {
      const interfaceUniqId = findScene.interfaceUniqId;
      const allScene = await ctx.service.scene.querySceneByInterfaceUniqId({ interfaceUniqId });
      const firstScene = allScene[0];
      if (firstScene) {
        await ctx.service.interface.updateInterface({
          uniqId: interfaceUniqId,
          payload: {
            currentScene: firstScene.sceneName,
          },
        });
      }
      ctx.success(res);
      return;
    }
    ctx.fail(ctx.gettext('common.delete.fail'));
  }
}

module.exports = SceneController;
