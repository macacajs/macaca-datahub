'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {

  async queryAllProject() {
    return await this.ctx.model.Project.findAll();
  }

  async queryProjectByUniqId() {
    return await this.ctx.model.Project.findAll();
  }

  async queryProjectByName(projectName) {
    console.log(`queryProjectByName ${projectName}`);
    return await this.ctx.model.Project.findAll();
  }

  async createProject() {
    return await this.ctx.model.Project.findAll();
  }

  async updateProject() {
    return await this.ctx.model.Project.findAll();
  }

  async deleteProjectByUniqId() {
    return await this.ctx.model.Project.findAll();
  }

  async syncDataToLocalFile() {
    return await this.ctx.model.Project.findAll();
  }
}

module.exports = ProjectService;

