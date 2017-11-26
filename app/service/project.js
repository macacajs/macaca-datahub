'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {

  async query() {
    return await this.ctx.app.ProjectModel.findAll();
  }

  async add(data) {
    return await this.ctx.app.ProjectModel.create({
      identifer: data.identifer,
      description: data.description,
    });
  }

  async updateById(data) {
    return await this.ctx.app.ProjectModel.update({
      ...data,
    }, {
      where: {
        identifer: data.identifer,
      },
    });
  }

  async queryById(projectId) {
    return await this.ctx.app.ProjectModel.findAll({
      where: {
        identifer: projectId,
      },
    });
  }

  async removeById(identifer) {
    return await this.ctx.app.ProjectModel.destroy({
      where: {
        identifer,
      },
    });
  }
}

module.exports = ProjectService;

