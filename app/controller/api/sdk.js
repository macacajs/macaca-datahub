'use strict';

const Controller = require('egg').Controller;

class SdkController extends Controller {

  get DEFAULT_CONTEXT_CONFIG() {
    return {};
  }

  async switchScene() {
    const ctx = this.ctx;
    const options = ctx.request.body;
    await this.switchOneScene(options);
    ctx.success();
  }

  async switchOneScene(options) {
    const ctx = this.ctx;
    // query interface options
    const projectName = options.hub;
    const pathname = options.pathname;
    const method = options.method || 'ALL';

    // change interface currentScene
    const sceneName = options.scene;

    // change interface contextConfig
    const contextConfig = this.DEFAULT_CONTEXT_CONFIG;
    if (!isNaN(options.status)) {
      contextConfig.responseStatus = parseInt(options.status, 10);
    }
    if (!isNaN(options.delay)) {
      contextConfig.responseDelay = parseFloat(options.delay);
    }
    if (typeof options.headers === 'object') contextConfig.responseHeaders = options.headers;

    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({ projectName });
    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    const payload = {};
    if (sceneName) {
      payload.currentScene = sceneName;
    }
    payload.contextConfig = contextConfig;

    await ctx.service.interface.updateInterface({
      uniqId: interfaceData.uniqId,
      payload,
    });
  }

  async switchMultiScenes() {
    const ctx = this.ctx;
    const optionsList = ctx.request.body;
    if (Array.isArray(optionsList)) {
      await Promise.all(optionsList.map(options => {
        return this.switchOneScene(options);
      }));
    }
    ctx.success();
  }

  async switchAllScenes() {
    const ctx = this.ctx;
    const options = ctx.request.body;
    // query interface options
    const projectName = options.hub;
    const sceneName = options.scene;
    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({ projectName });
    const interfaceList = await ctx.service.interface.queryInterfaceByProjectUniqId({ projectUniqId });
    await Promise.all(interfaceList.map(async interfaceData => {
      const sceneData = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
        interfaceUniqId: interfaceData.uniqId,
        sceneName,
      });
      if (!sceneData) return;
      await ctx.service.interface.updateInterface({
        uniqId: interfaceData.uniqId,
        payload: {
          currentScene: sceneData.sceneName,
          contextConfig: this.DEFAULT_CONTEXT_CONFIG,
        },
      });
    }));
    ctx.success();
  }
}

module.exports = SdkController;
