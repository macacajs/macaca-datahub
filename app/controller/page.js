'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  async home() {
    this.ctx.body = await this.app.render({}, {
      title: this.ctx.gettext('homepage'),
      pageId: 'home',
      assetsDir: this.config.datahubView.assetsDir,
    });
  }

  async dashboard() {
    const res = await this.ctx.service.project.query();
    this.ctx.body = await this.app.render(res, {
      title: this.ctx.gettext('dashboard'),
      pageId: 'dashboard',
      assetsDir: this.config.datahubView.assetsDir,
    });
  }

  async project() {
    const res = await this.ctx.service.project.query();
    this.ctx.body = await this.app.render(res, {
      title: `${this.ctx.gettext('project')} - ${this.ctx.params.projectId}`,
      pageId: 'project',
      assetsDir: this.config.datahubView.assetsDir,
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
