'use strict';

const {
  Controller,
} = require('egg');

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
    const tagName = options.tagName;

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
    if (typeof options.headers === 'object') {
      contextConfig.responseHeaders = options.headers;
    }

    const projectData = await ctx.service.project.queryProjectByName({
      projectName,
    });

    if (!projectData) {
      ctx.logger.error(`SwitchScene failed: Can\'t find project ${projectName}`);
      return;
    }
    const projectUniqId = projectData.uniqId;

    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    if (!interfaceData) {
      ctx.logger.error('SwitchScene failed: Can\'t find data for ' +
      `${projectName}, pathname: ${pathname}, method: ${method}`);
      return;
    }

    const payload = {};

    if (sceneName) {
      payload.currentScene = sceneName;
    }

    payload.contextConfig = contextConfig;

    if (tagName) {
      payload.originInterfaceId = interfaceData.uniqId;
      payload.tagName = tagName;

      await ctx.service.interface.updateShadowInterface({
        originInterfaceId: interfaceData.uniqId,
        tagName,
        payload,
      });
    } else {
      await ctx.service.interface.updateInterface({
        uniqId: interfaceData.uniqId,
        payload,
      });
    }
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
    const tagName = options.tagName;
    const projectData = await ctx.service.project.queryProjectByName({
      projectName,
    });

    if (!projectData) {
      ctx.logger.error(`SwitchAllScenes failed: Can\'t find project ${projectName}`);
      return;
    }
    const projectUniqId = projectData.uniqId;
    const interfaceList = await ctx.service.interface.queryInterfaceByProjectUniqId({ projectUniqId });
    await Promise.all(interfaceList.map(async interfaceData => {
      const sceneData = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
        interfaceUniqId: interfaceData.uniqId,
        sceneName,
      });
      if (!sceneData) {
        return;
      }
      const payload = {
        contextConfig: this.DEFAULT_CONTEXT_CONFIG,
      };

      if (sceneName) {
        payload.currentScene = sceneData.sceneName;
      }

      if (tagName) {
        payload.originInterfaceId = interfaceData.uniqId;
        payload.tagName = tagName;
        await ctx.service.interface.updateShadowInterface({
          originInterfaceId: interfaceData.uniqId,
          tagName,
          payload,
        });
      } else {
        await ctx.service.interface.updateInterface({
          uniqId: interfaceData.uniqId,
          payload,
        });
      }
    }));
    ctx.success();
  }

  async switchAllProxy() {
    const ctx = this.ctx;
    const {
      projectUniqId,
      enabled,
    } = ctx.request.body;
    const res = await ctx.service.interface.updateAllProxy({
      projectUniqId,
      enabled,
    });
    ctx.success(res);
  }

  async exportData() {
    const ctx = this.ctx;
    await ctx.service.database.exportData();
    ctx.success();
  }
}

module.exports = SdkController;
