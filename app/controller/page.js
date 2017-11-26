'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  async home() {
    this.ctx.body = await this.app.render({}, {
      title: this.ctx.gettext('homepage'),
      pageId: 'home',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
    });
  }

  async dashboard() {
    const res = await this.ctx.service.project.query();
    this.ctx.body = await this.app.render(res, {
      title: this.ctx.gettext('dashboard'),
      pageId: 'dashboard',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
    });
  }

  async project() {
    const res = await this.ctx.service.project.query();
    this.ctx.body = await this.app.render(res, {
      title: `${this.ctx.gettext('project')} - ${this.ctx.params.projectId}`,
      pageId: 'project',
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
    });
  }

  async notfound() {
    this.ctx.body = {
      success: false,
      errorMessage: 'databub api not found',
    };
  }
}

module.exports = PageController;

