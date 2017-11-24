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

  async removeById(identifer) {
    return await this.ctx.app.ProjectModel.destroy({
      where: {
        identifer,
      },
    });
  }
}

module.exports = ProjectService;

