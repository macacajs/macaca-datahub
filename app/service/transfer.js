'use strict';

const {
  Service,
} = require('egg');

class TransferService extends Service {

  async downloadProject({
    uniqId,
  }) {
    const sceneGroups = await this.ctx.service.sceneGroup.querySceneGroupByProjectUniqId({
      projectUniqId: uniqId,
    });

    const interfaces = await this.ctx.service.interface.queryInterfaceByProjectUniqId({
      projectUniqId: uniqId,
    });

    const data = {};
    const interfaceList = [];

    for (const interfaceData of interfaces) {
      const scenes = await this.ctx.service.scene.querySceneByInterfaceUniqId({
        interfaceUniqId: interfaceData.uniqId,
      });

      const schemas = await this.ctx.service.schema.querySchemaByInterfaceUniqId({
        interfaceUniqId: interfaceData.uniqId,
      });

      interfaceList.push({
        pathname: interfaceData.pathname,
        method: interfaceData.method,
        description: interfaceData.description,
        uniqId: interfaceData.uniqId,
        contextConfig: interfaceData.contextConfig,
        currentScene: interfaceData.currentScene,
        proxyConfig: interfaceData.proxyConfig,
        scenes,
        schemas,
      });
    }

    data.sceneGroups = sceneGroups;
    data.interfaceList = interfaceList;

    const info = await this.ctx.service.project.queryProjectByUniqId({ uniqId });
    const fileName = `project_${info.projectName}.json`;

    return {
      data,
      fileName,
    };
  }

  async uploadProject({
    projectData,
    projectUniqId,
  }) {
    await this.ctx.model.Interface.destroy({
      where: {
        projectUniqId,
      },
    });

    await this.ctx.model.SceneGroup.destroy({
      where: {
        projectUniqId,
      },
    });

    for (const interfaceData of projectData.interfaceList) {
      const interfaceStatus = await this.ctx.model.Interface.create({
        projectUniqId,
        pathname: interfaceData.pathname,
        method: interfaceData.method,
        description: interfaceData.description,
        contextConfig: interfaceData.contextConfig,
        currentScene: interfaceData.currentScene,
        proxyConfig: interfaceData.proxyConfig,
      });

      for (const scene of interfaceData.scenes) {
        await this.ctx.model.Scene.create({
          interfaceUniqId: interfaceStatus.uniqId,
          sceneName: scene.sceneName,
          data: scene.data,
        });
      }

      for (const schema of interfaceData.schemas) {
        await this.ctx.model.Schema.upsert({
          interfaceUniqId: interfaceStatus.uniqId,
          type: schema.type,
          data: schema.data,
        });
      }
    }

    for (const sceneGroup of projectData.sceneGroups) {
      await this.ctx.model.SceneGroup.create({
        projectUniqId,
        sceneGroupName: sceneGroup.sceneGroupName,
        description: sceneGroup.description,
        interfaceList: sceneGroup.interfaceList,
        enable: sceneGroup.enable,
      });
    }

    return {
      success: true,
    };
  }

  async downloadInterface({
    interfaceUniqId,
  }) {
    const scenes = await this.ctx.model.Scene.findAll({
      where: {
        interfaceUniqId,
      },
    });

    const schemas = await this.ctx.service.schema.querySchemaByInterfaceUniqId({
      interfaceUniqId,
    });

    const interfaceData = await this.ctx.service.interface.queryInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });
    const fileName = `interface_${interfaceData.pathname}_${interfaceData.method}.json`;

    return {
      fileName,
      data: {
        pathname: interfaceData.pathname,
        method: interfaceData.method,
        projectUniqId: interfaceData.uniqId,
        description: interfaceData.description,
        contextConfig: interfaceData.contextConfig,
        currentScene: interfaceData.currentScene,
        proxyConfig: interfaceData.proxyConfig,
        scenes,
        schemas,
      },
    };
  }

  async uploadInterface({
    interfaceData,
    interfaceUniqId,
  }) {
    const interfaceOldData = await this.ctx.service.interface.queryInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });

    await this.ctx.service.interface.deleteInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });

    const interfaceStatus = await this.ctx.model.Interface.create({
      pathname: interfaceOldData.pathname,
      method: interfaceOldData.method,
      projectUniqId: interfaceOldData.projectUniqId,
      description: interfaceOldData.description,
      contextConfig: interfaceData.contextConfig,
      currentScene: interfaceData.currentScene,
      proxyConfig: interfaceData.proxyConfig,
    });

    for (const scene of interfaceData.scenes) {
      await this.ctx.model.Scene.create({
        interfaceUniqId: interfaceStatus.uniqId,
        sceneName: scene.sceneName,
        data: scene.data,
      });
    }

    for (const schema of interfaceData.schemas) {
      await this.ctx.model.Schema.upsert({
        interfaceUniqId: interfaceStatus.uniqId,
        type: schema.type,
        data: schema.data,
      });
    }

    return {
      success: true,
    };
  }
}

module.exports = TransferService;

