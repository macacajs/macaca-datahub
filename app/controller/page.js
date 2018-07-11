'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  async home() {
    this.ctx.body = await this.app.render({}, {
      title: this.ctx.gettext('homepage'),
      pageId: 'home',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
      version: this.app.config.pkg.version,
    });
  }

  async dashboard() {
    const res = await this.ctx.service.project.queryAllProject();
    this.ctx.body = await this.app.render(res, {
      title: this.ctx.gettext('dashboard'),
      pageId: 'dashboard',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
      version: this.app.config.pkg.version,
    });
  }

  async project() {
    const res = await this.ctx.service.project.queryAllProject();
    const projectId = this.ctx.params.projectId;
    this.ctx.body = await this.app.render(res, {
      title: `${this.ctx.gettext('project')} - ${projectId}`,
      pageId: 'project',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
      socket: this.app.config.socket,
      version: this.app.config.pkg.version,
      projectId,
    });
  }

  async doc() {
    const res = await this.ctx.service.project.queryAllProject();
    const projectName = this.ctx.params.projectName;
    this.ctx.body = await this.app.render(res, {
      title: `${this.ctx.gettext('doc')} - ${projectName}`,
      pageId: 'doc',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
      socket: this.app.config.socket,
      version: this.app.config.pkg.version,
      projectName,
    });
  }

  async notfound() {
    this.ctx.body = {
      success: false,
      errorMessage: 'databub interface not found',
    };
  }
}

module.exports = PageController;

