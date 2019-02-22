'use strict';

const {
  Controller,
} = require('egg');

class SdkController extends Controller {

  get DEFAULT_CONTEXT_CONFIG() {
    return {};
  }

  async sceneData() {
    const ctx = this.ctx;
    // query scene params
    const {
      hub,
      pathname,
      method = 'ALL',
      scene,
    } = ctx.query;

    const projectData = await ctx.service.project.queryProjectByName({
      projectName: hub,
    });

    if (!projectData || !projectData.uniqId) {
      ctx.logger.error(`getSceneData failed: Can\'t find project ${hub}`);
      return;
    }
    const projectUniqId = projectData.uniqId;

    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    if (!interfaceData || !interfaceData.uniqId) {
      ctx.logger.error('getSceneData failed: Can\'t find data for ' +
      `${hub}, pathname: ${pathname}, method: ${method}`);
      return;
    }

    const res = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
      interfaceUniqId: interfaceData.uniqId,
      sceneName: scene,
    });

    ctx.success(res.data);
  }

  async switchScene() {
    const ctx = this.ctx;
    const options = ctx.request.body;
    const status = await this.switchOneScene(options);
    if (status) {
      ctx.success();
    } else {
      ctx.fail();
    }
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

    const projectData = await ctx.service.project.queryProjectByName({
      projectName,
    });

    if (!projectData || !projectData.uniqId) {
      ctx.logger.error(`SwitchScene failed: Can\'t find project ${projectName}`);
      return false;
    }
    const projectUniqId = projectData.uniqId;

    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    if (!interfaceData || !interfaceData.uniqId) {
      ctx.logger.error('SwitchScene failed: Can\'t find data for ' +
      `${projectName}, pathname: ${pathname}, method: ${method}`);
      return false;
    }

    const payload = {};

    if (sceneName) {
      payload.currentScene = sceneName;
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
    return true;
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

    if (!projectData || !projectData.uniqId) {
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

      if (!sceneData || !sceneData.uniqId) {
        return;
      }
      const payload = {};

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

  async addGlobalProxy() {
    const ctx = this.ctx;
    const {
      projectUniqId,
      globalProxy,
    } = ctx.request.body;
    const res = await ctx.service.project.addGlobalProxy({
      projectUniqId,
      globalProxy,
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
