'use strict';

const url = require('url');
const Controller = require('egg').Controller;

const ALLOWED_PROXY_HEADERS = [
  'set-cookie',
  'content-type',
];

class SceneController extends Controller {

  async index() {
    const ctx = this.ctx;
    const params = ctx.params;
    const projectName = params.projectName;
    const pathname = params.pathname;
    const method = ctx.method;

    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({ projectName });
    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    if (!interfaceData) {
      this.fail(`${method} ${pathname} not found`);
      return;
    }

    const { contextConfig, proxyConfig } = interfaceData;

    if (contextConfig.responseDelay) {
      ctx[Symbol.for('context#rewriteResponseDelay')] = Number.parseInt(contextConfig.responseDelay, 10);
    }
    if (contextConfig.responseStatus) {
      ctx[Symbol.for('context#rewriteResponseStatus')] = Number.parseInt(contextConfig.responseStatus, 10);
    }

    const { enabled: proxyEnabled, proxyList = [], activeIndex = 0 } = proxyConfig;
    ctx.logger.debug('proxy config %s', JSON.stringify(proxyConfig, null, 2));
    if (proxyEnabled && proxyList[activeIndex].proxyUrl) {
      ctx[Symbol.for('context#useProxy')] = true;
      const parsedUrl = url.parse(proxyList[activeIndex].proxyUrl);
      let proxyUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
      const parseOrigindUrl = url.parse(ctx.request.url);
      if (parseOrigindUrl.search) {
        proxyUrl += parseOrigindUrl.search;
      }
      const _res = await ctx.curl(proxyUrl, {
        method: ctx.method,
        headers: ctx.headers,
        timeout: 5 * 1000,
        data: ctx.request.body,
        dataType: 'text',
      });
      for (const key of ALLOWED_PROXY_HEADERS) {
        _res.headers[key] && ctx.set(key, _res.headers[key]);
      }
      ctx[Symbol.for('context#proxyResponseStatus')] = _res.status;
      ctx.status = _res.status;
      ctx.body = _res.data;
      return;
    }

    const res = await ctx.service.scene.querySceneByUniqId({
      uniqId: interfaceData.currentScene,
    });

    res ?
      ctx.body = res.data :
      this.fail(`${method} ${pathname} '${interfaceData.currentScene}' scene not found`);
  }

  fail(message) {
    const ctx = this.ctx;
    ctx.set('x-datahub-fail', message);
    ctx.status = 400;
    ctx.body = {};
  }
}

module.exports = SceneController;
