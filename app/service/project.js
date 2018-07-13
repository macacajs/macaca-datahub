'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {

  async queryAllProject() {
    return await this.ctx.model.Project.findAll({
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
  }

  async queryProjectByUniqId({ uniqId }) {
    return await this.ctx.model.Project.findOne({
      where: {
        uniqId,
      },
    });
  }

  async queryProjectByProjectName({ projectName }) {
    return await this.ctx.model.Project.findOne({
      where: {
        projectName,
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

  async syncDataToLocalFile() {
    return await this.ctx.model.Project.findAll();
  }
}

module.exports = ProjectService;

