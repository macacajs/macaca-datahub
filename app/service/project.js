'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {

  async queryAllProject(selector = {}) {
    return await this.ctx.model.Project.findAll({
      ...selector,
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
  }

  async queryProjectByName({ projectName }) {
    return await this.ctx.model.Project.findOne({
      where: {
        projectName,
      },
    });
  }

  async queryProjectByUniqId({ uniqId }) {
    return await this.ctx.model.Project.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createProject({ projectName, description, globalProxy }) {
    const { ctx } = this;

    const project = await ctx.model.Project.create({
      projectName,
      description,
      globalProxy,
    });

    await ctx.model.Group.create({
      groupName: ctx.gettext('defaultGroupName'),
      groupType: 'Interface',
      belongedUniqId: project.uniqId,
    });

    return project;
  }

  async updateProject({ uniqId, payload }) {
    return await this.ctx.model.Project.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async deleteProjectByUniqId({ uniqId }) {
    const { ctx } = this;

    await ctx.model.Group.destroy({
      where: {
        belongedUniqId: uniqId,
        groupType: 'Interface',
      }
    });

    const interfaces = await ctx.service.interface.queryInterfaceByProjectUniqId({ 
      projectUniqId: uniqId,
     });

    for (const interfaceData of interfaces) {
      await ctx.service.interface.deleteInterfaceByUniqId({
        uniqId: interfaceData.uniqId,
      });
    }

    return await ctx.model.Project.destroy({
      where: {
        uniqId,
      },
    });
  }

  async addGlobalProxy({
    projectUniqId,
    globalProxy,
  }) {
    if (!globalProxy) return null;

    const projectInfo = await this.ctx.model.Project.findOne({
      where: {
        uniqId: projectUniqId,
      },
    });

    const oldGlobalProxy = projectInfo.globalProxy;

    if (globalProxy === oldGlobalProxy) return null;

    const interfaces = await this.ctx.model.Interface.findAll({
      where: {
        projectUniqId,
      },
    });

    // update global proxy
    await Promise.all(interfaces.map(async item => {
      if (item.proxyConfig &&
        item.proxyConfig.proxyList &&
        item.proxyConfig.proxyList.length
      ) {
        const list = item.proxyConfig.proxyList;
        // remove old global proxy
        list.splice(list.indexOf(list.find(i => i.proxyUrl === oldGlobalProxy)), 1);

        // add new global proxy
        if (!list.find(item => item.proxyUrl === globalProxy)) {
          list.push({
            proxyUrl: globalProxy,
          });
          item.proxyConfig.activeIndex = list.length - 1;
        }

      } else {
        item.proxyConfig = {
          enabled: false,
          activeIndex: 0,
          proxyList: [{
            proxyUrl: globalProxy,
          }],
        };
      }
      return await this.ctx.model.Interface.update(
        {
          proxyConfig: item.proxyConfig,
        },
        {
          where: {
            uniqId: item.dataValues.uniqId,
          },
        }
      );
    }));

    return null;
  }
}

module.exports = ProjectService;
