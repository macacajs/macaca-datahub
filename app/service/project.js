'use strict';

const Service = require('egg').Service;
const toString = require('stream-to-string');

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

  async createProject({ projectName, description }) {
    return await this.ctx.model.Project.create({
      projectName,
      description,
    });
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
    return await this.ctx.model.Project.destroy({
      where: {
        uniqId,
      },
    });
  }

  async downloadProjectByUniqId({ uniqId }) {
    const interfaces = await this.ctx.service.interface.queryInterfaceByProjectUniqId({
      projectUniqId: uniqId,
    });

    if (!interfaces || !interfaces.length) {
      return null;
    }

    const result = [];

    for (const interfaceData of interfaces) {
      const scenes = await this.ctx.service.scene.querySceneByInterfaceUniqId({
        interfaceUniqId: interfaceData.uniqId,
      });

      result.push({
        pathname: interfaceData.pathname,
        method: interfaceData.method,
        description: interfaceData.description,
        uniqId: interfaceData.uniqId,
        currentScene: interfaceData.currentScene,
        scenes,
      });
    }

    return result;
  }

  async uploadProjectByUniqId() {
    const stream = await this.ctx.getFileStream();
    const projectStr = await toString(stream);
    const projectData = JSON.parse(projectStr);
    const projectUniqId = stream.fieldname;

    try {
      await this.ctx.model.Interface.destroy({
        where: {
          projectUniqId,
        },
      });

      for (const interfaceData of projectData.data) {
        const interfaceStatus = await this.ctx.model.Interface.create({
          projectUniqId,
          pathname: interfaceData.pathname,
          method: interfaceData.method,
          description: interfaceData.description,
          currentScene: interfaceData.currentScene,
        });

        for (const scene of interfaceData.scenes) {
          await this.ctx.model.Scene.create({
            interfaceUniqId: interfaceStatus.uniqId,
            sceneName: scene.sceneName,
            data: scene.data,
          });
        }
      }
    } catch (err) {
      return err;
    }

    return {
      status: 'success',
    };
  }
}

module.exports = ProjectService;
