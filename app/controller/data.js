'use strict';

const { Controller } = require('egg');
const url = require('url');
const cookie = require('cookie');
const sendToWormhole = require('stream-wormhole');

const ALLOWED_PROXY_HEADERS = ['set-cookie', 'content-type'];

class SceneController extends Controller {
  async index() {
    const { ctx } = this;
    const params = ctx.params;
    const projectName = params.projectName;
    const pathname = params.pathname;
    const method = ctx.method;

    // The global, highest priority server side config.
    const featureConfig = ctx.app.config.featureConfig;
    const enableJavascript = featureConfig && featureConfig.enableJavascript;
    const enableRequestProxy = featureConfig && featureConfig.enableRequestProxy;

    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({
      projectName,
    });

    const cookieKeyPair = cookie.parse(ctx.header.cookie || '');
    const tagName = cookieKeyPair && cookieKeyPair.DATAHUB_CACHE_TAG;

    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
      tagName,
    });

    if (!interfaceData) {
      this.fail(`${method} ${pathname} not found`);
      return;
    }

    const { proxyConfig } = interfaceData;

    if (!tagName) {
      const { enabled: proxyEnabled, proxyList = [], activeIndex = 0 } = proxyConfig;

      ctx.logger.debug('proxy config %s', JSON.stringify(proxyConfig, null, 2));
      if (enableRequestProxy && proxyEnabled && proxyList[activeIndex].proxyUrl) {
        ctx[Symbol.for('context#useProxy')] = true;
        const parsedUrl = url.parse(proxyList[activeIndex].proxyUrl);
        let proxyUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
        const parseOriginUrl = url.parse(ctx.request.url);

        proxyUrl += parseOriginUrl.path.replace(`/data/${projectName}/`, '');

        const _res = await ctx.curl(proxyUrl, {
          method: ctx.method,
          headers: Object.assign({}, ctx.headers, {
            host: parsedUrl.host,
          }),
          followRedirect: true,
          timeout: 120 * 1000,
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
    }

    const { currentScene, uniqId, originInterfaceId } = interfaceData;

    const interfaceUniqId = tagName && originInterfaceId ? originInterfaceId : uniqId;

    let res;
    // try to use custom scene by default
    if (ctx.query.__datahub_scene) {
      res = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
        interfaceUniqId,
        sceneName: ctx.query.__datahub_scene,
      });
    }
    if (!res) {
      res = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
        interfaceUniqId,
        sceneName: currentScene,
      });
    }

    if (!res) {
      ctx.body = 'Please select a scene or create a scene !';
      return;
    }

    const { contextConfig, data, format } = res;

    if (contextConfig.responseDelay) {
      ctx[Symbol.for('context#rewriteResponseDelay')] = Number.parseFloat(contextConfig.responseDelay);
    }
    if (contextConfig.responseStatus) {
      ctx[Symbol.for('context#rewriteResponseStatus')] = Number.parseInt(contextConfig.responseStatus, 10);
    }
    if (contextConfig.responseHeaders) {
      ctx[Symbol.for('context#rewriteResponseHeaders')] = contextConfig.responseHeaders;
    }

    if (method === 'POST' && ctx.get('content-type').includes('multipart/form-data')) {
      const stream = await ctx.getFileStream();
      const filename = stream.filename;
      // send to wormhole if has binary file
      await sendToWormhole(stream);
      // fake stream
      ctx.stream = {
        filename,
      };
    }

    if (format === 'json') {
      ctx.body = data;
    } else if (enableJavascript && format === 'javascript') {
      const { constructor: AsyncFunction } = Object.getPrototypeOf(async () => {});
      try {
        const code = decodeURIComponent(data);
        const func = AsyncFunction('ctx', '$mock', code);
        ctx.getSceneData = async (sceneName) => {
          if (sceneName === currentScene) return {};
          const res = await ctx.service.scene.querySceneByInterfaceUniqIdAndSceneName({
            interfaceUniqId,
            sceneName,
          });
          if (!res) return {};
          const { format, data } = res;
          if (format === 'json' && data) {
            return data;
          }
          return {};
        };
        const Mock = require('mockjs');
        const Faker = require('faker');
        const $mock = {
          Mock,
          Faker,
        };
        await func(ctx, $mock);
      } catch (e) {
        console.log(e);
      }
    } else {
      ctx.body = '';
    }
  }

  fail(message) {
    const ctx = this.ctx;
    ctx.set('x-datahub-fail', message);
    ctx.status = 400;
    ctx.body = {};
  }
}

module.exports = SceneController;
