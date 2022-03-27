'use strict';

const path = require('path');
const { pathToRegexp } = require('path-to-regexp');
const boardRootPath = require.resolve('debugger-board');
const proxyMiddleware = require('http-proxy-middleware');

const defaultOptions = {
  protocol: 'http',
  hub: 'default',
  changeOrigin: false,
  showBoard: false
};

const getProxyMiddlewares = (options) => {
  const middlewares = [];
  Object.keys(options.proxy).forEach(router => {
    const config = options.proxy[router];
    const protocol = config.protocol || options.protocol || defaultOptions.protocol;
    const hostname = config.hostname || options.hostname || defaultOptions.hostname;
    const port = config.port || options.port || defaultOptions.port;
    const hub = config.hub || options.hub || defaultOptions.hub;
    const changeOrigin = config.changeOrigin || options.changeOrigin || defaultOptions.changeOrigin;
    const rewrite = config.rewrite || options.rewrite || '^/';
    const pathOptions = config.pathOptions || options.pathOptions || {};
    pathOptions.end = pathOptions.end || false;

    const target = `${protocol}://${hostname}${port ? `:${port}` : ''}`;
    const regexp = pathToRegexp(router, null, pathOptions);
    const proxy = proxyMiddleware({
      target,
      changeOrigin,
      logLevel: 'error',
      pathRewrite: {
        [rewrite]: `/data/${hub}/`
      }
    });

    middlewares.push((req, res, next) => {
      if (regexp.exec(req.url)) {
        // proxy to datahub if path matched
        proxy(req, res, next);
      } else {
        // else do nothing
        next();
      }
    });
  });

  if (options.showBoard) {
    const express = require('express');
    const staticDir = path.resolve(boardRootPath, '..', 'dist');
    middlewares.push(express.static(staticDir));
  }

  return middlewares;
};

module.exports = app => {
  return options => {
    options.showBoard = options.showBoard || defaultOptions.showBoard;

    const proxyMiddlewares = getProxyMiddlewares(options);
    proxyMiddlewares.forEach(middleware => app.use(middleware));

    if (options.showBoard) {
      const replaceBody = (options, origin) => {
        return `
          <script src="/debugger-board.js"></script>
          <script>
            window._debugger_board_datahub_options = ${JSON.stringify(options)};
            window._debugger_board.append(document.body);
          </script>
          ${origin}
        `;
      };

      app.use((req, res, next) => {
        if (req.headers && req.headers.accept && !!~req.headers.accept.indexOf('text/html')) {
          const _end = res.end;
          res.end = function(data) {
            if (data) {
              let body = data.toString();
              if (/<\/body>/.test(body)) {
                try {
                  body = body.replace(/<\/body>/, origin => replaceBody(options, origin));
                  res.set({ 'Content-Length': Buffer.byteLength(body, 'utf-8') });
                  _end.call(res, body);
                  return;
                } catch (e) {}
              }
            }
            _end.apply(res, [ ...arguments ]);
          };
          const _write = res.write;
          res.write = function(data) {
            let body = data.toString();
            if (/<\/body>/.test(body)) {
              try {
                body = body.replace(/<\/body>/, origin => replaceBody(options, origin));
                res.set({ 'Content-Length': Buffer.byteLength(body, 'utf-8') });
                _write.call(res, body);
                return;
              } catch (e) {}
            }
            _write.apply(res, [ ...arguments ]);
          };
          const _send = res.send;
          res.send = function(string) {
            let body = Buffer.isBuffer(string) ? string.toString() : string;
            body = body.replace(/<\/body>/, origin => replaceBody(options, origin));
            _send.call(this, body);
          };
        }
        next();
      });
    }
  };
};

module.exports.getProxyMiddlewares = getProxyMiddlewares;
