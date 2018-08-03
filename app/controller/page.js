'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  get commonPageConfig() {
    return {
      assetsUrl: process.env.DATAHUB_VIEW_CONFIG_ASSETSURL || this.config.dataHubView.assetsUrl,
      version: this.app.config.pkg.version,
    };
  }

  async home() {
    this.ctx.body = await this.app.render({}, {
      ...this.commonPageConfig,
      title: this.ctx.gettext('homepage'),
      pageId: 'home',
    });
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
    const res = await this.ctx.service.project.queryProjectByProjectName({ projectName });
    this.ctx.body = await this.app.render({
      ...res.get({ plain: true }),
      socket: this.app.config.socket,
    }, {
      ...this.commonPageConfig,
      title: `${this.ctx.gettext('project')} - ${projectName}`,
      pageId: 'project',
    });
  }

  async doc() {
    const projectName = this.ctx.params.projectName;
    const res = await this.ctx.service.project.queryProjectByProjectName({ projectName });
    this.ctx.body = await this.app.render(res, {
      ...this.commonPageConfig,
      title: `${this.ctx.gettext('document')} - ${projectName}`,
      pageId: 'document',
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

