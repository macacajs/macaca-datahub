'use strict';

const {
  Service,
} = require('egg');

class TransferService extends Service {

  async downloadProject({
    uniqId,
  }) {
    const { ctx } = this;

    const interfaceGroups = await ctx.service.interface.queryInterfaceDataByProjectUniqId({
      projectUniqId: uniqId,
    });

    const dataGroupList = [];

    for (const interfaceGroup of interfaceGroups.interfaceGroupList) {
      const data = [];
      for (const interfaceData of interfaceGroup.interfaceList) {
        const scenes = await ctx.service.scene.querySceneByInterfaceUniqId({
          interfaceUniqId: interfaceData.uniqId,
        });

        const schemas = await ctx.service.schema.querySchemaByInterfaceUniqId({
          interfaceUniqId: interfaceData.uniqId,
        });

        data.push({
          pathname: interfaceData.pathname,
          method: interfaceData.method,
          description: interfaceData.description,
          uniqId: interfaceData.uniqId,
          groupUniqId: interfaceData.groupUniqId,
          contextConfig: interfaceData.contextConfig,
          currentScene: interfaceData.currentScene,
          proxyConfig: interfaceData.proxyConfig,
          scenes,
          schemas,
        });
      }
      dataGroupList.push({
        groupName: interfaceGroup.groupName,
        groupUniqId: interfaceGroup.groupUniqId,
        interfaceList: data,
      })
    }

    const info = await ctx.service.project.queryProjectByUniqId({ uniqId });
    const fileName = `project_${info.projectName}.json`;

    return {
      dataGroupList,
      fileName,
    };
  }

  async uploadProject({
    projectData,
    projectUniqId,
  }) {
    const { ctx } = this;

    await ctx.model.Interface.destroy({
      where: {
        projectUniqId,
      },
    });

    await ctx.model.Group.destroy({
      where: {
        belongedUniqId: projectUniqId,
      },
    });

    // compatible with old project data
    const interfaceGroupList = (projectData[0] && projectData[0].interfaceList) ? projectData : [{
      groupName: ctx.gettext('defaultGroupName'),
      interfaceList: projectData,
    }];

    for (const interfaceGroup of interfaceGroupList) {
      const group = await ctx.service.group.createGroup({
        belongedUniqId: projectUniqId,
        groupName: interfaceGroup.groupName,
        groupType: 'Interface',
      });

      for (const interfaceData of interfaceGroup.interfaceList) {
        const interfaceStatus = await ctx.model.Interface.create({
          projectUniqId,
          pathname: interfaceData.pathname,
          method: interfaceData.method,
          description: interfaceData.description,
          groupUniqId: group.uniqId,
          contextConfig: interfaceData.contextConfig,
          currentScene: interfaceData.currentScene,
          proxyConfig: interfaceData.proxyConfig,
        });

        await ctx.service.interface.duplicateScenes({
          uniqId: interfaceStatus.uniqId,
          scenes: interfaceData.scenes,
        });
    
        await ctx.service.interface.duplicateSchemas({
          uniqId: interfaceStatus.uniqId,
          schemas: interfaceData.schemas,
        });
      }
    }

    return {
      success: true,
    };
  }

  async downloadInterface({
    interfaceUniqId,
  }) {
    const { ctx } = this;

    const scenes = await ctx.model.Scene.findAll({
      where: {
        interfaceUniqId,
      },
    });

    const schemas = await ctx.service.schema.querySchemaByInterfaceUniqId({
      interfaceUniqId,
    });

    const interfaceData = await ctx.service.interface.queryInterfaceByUniqId({
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
        groupUniqId: interfaceData.groupUniqId,
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
    const { ctx } = this;

    const interfaceOldData = await ctx.service.interface.queryInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });

    await ctx.service.interface.deleteInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });

    const interfaceStatus = await ctx.model.Interface.create({
      pathname: interfaceOldData.pathname,
      method: interfaceOldData.method,
      projectUniqId: interfaceOldData.projectUniqId,
      description: interfaceOldData.description,
      groupUniqId: interfaceOldData.groupUniqId,
      contextConfig: interfaceData.contextConfig,
      currentScene: interfaceData.currentScene,
      proxyConfig: interfaceData.proxyConfig,
    });

    await ctx.service.interface.duplicateScenes({
      uniqId: interfaceStatus.uniqId,
      scenes: interfaceData.scenes,
    });

    await ctx.service.interface.duplicateSchemas({
      uniqId: interfaceStatus.uniqId,
      schemas: interfaceData.schemas,
    });

    return {
      success: true,
      newInterfaceUniqId: interfaceStatus.uniqId,
    };
  }
}

module.exports = TransferService;

