'use strict';

const Controller = require('egg').Controller;

class SdkController extends Controller {

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
    const contextConfig = {};
    if (!isNaN(options.status)) {
      contextConfig.responseStatus = parseInt(options.status, 10);
    }
    if (!isNaN(options.delay)) {
      contextConfig.responseDelay = parseInt(options.delay, 10);
    }
    if (typeof options.headers === 'object') contextConfig.responseHeaders = options.headers;

    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({ projectName });
    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });
    const sceneData = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
      interfaceUniqId: interfaceData.uniqId,
      sceneName,
    });
    const currentScene = sceneData.uniqId;
    await ctx.service.interface.updateInterface({
      uniqId: interfaceData.uniqId,
      payload: {
        currentScene,
        contextConfig: {
          ...interfaceData.contextConfig,
          ...contextConfig,
        },
      },
    });
  }

  async switchMultiScenes() {
    const ctx = this.ctx;
    const optionsList = ctx.request.body;
    if (Array.isArray(optionsList)) {
      await optionsList.map(options => (async () => {
        await this.switchOneScene(options);
      })());
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
    await interfaceList.map(interfaceData => (async () => {
      const sceneData = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
        interfaceUniqId: interfaceData.uniqId,
        sceneName,
      });
      if (!sceneData) return;
      await ctx.service.interface.updateInterface({
        uniqId: interfaceData.uniqId,
        payload: {
          currentScene: sceneData.uniqId,
        },
      });
    })());
    ctx.success();
  }
}

module.exports = SdkController;
