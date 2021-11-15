'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  get commonPageConfig() {
    const { app } = this;
    return {
      env: app.config.env,
      version: app.config.pkg.version,
      featureConfig: app.config.featureConfig,
    };
  }

  async home() {
    this.ctx.body = await this.app.render(
      {},
      {
        ...this.commonPageConfig,
        title: this.ctx.gettext('homepage'),
        pageId: 'home',
      },
    );
  }

  async dashboard() {
    const res = await this.ctx.service.project.queryAllProject();
    this.ctx.body = await this.app.render(res, {
      ...this.commonPageConfig,
      title: this.ctx.gettext('dashboard'),
      pageId: 'dashboard',
    });
  }

  async project() {
    const projectName = this.ctx.params.projectName;
    const res = await this.ctx.service.project.queryProjectByName({
      projectName,
    });
    const allProjects = await this.ctx.service.project.queryAllProject();
    this.ctx.body = await this.app.render(
      {
        ...res.get({
          plain: true,
        }),
        allProjects,
        socket: this.app.config.dataHubSocket,
      },
      {
        ...this.commonPageConfig,
        title: `${this.ctx.gettext('project')} - ${projectName}`,
        pageId: 'project',
      },
    );
  }

  async doc() {
    const projectName = this.ctx.params.projectName;
    const res = await this.ctx.service.project.queryProjectByName({ projectName });
    this.ctx.body = await this.app.render(res, {
      ...this.commonPageConfig,
      title: `${this.ctx.gettext('document')} - ${projectName}`,
      pageId: 'document',
    });
  }

  async notfound() {
    this.ctx.body = {
      success: false,
      errorMessage: 'databub interface not found, try to update macaca-datahub.',
    };
  }
}

module.exports = PageController;
