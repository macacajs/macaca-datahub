'use strict';

const _ = require('xutil');

const useProxy = Symbol.for('context#useProxy');
const proxyResponseStatus = Symbol.for('context#proxyResponseStatus');
const rewriteResponseStatus = Symbol.for('context#rewriteResponseStatus');

const socket = require('../socket');

module.exports = () => {
  return async function socketEmit(ctx, next) {
    await next();

    const rewriteResponseStatusCode = ctx[rewriteResponseStatus];

    const date = _.moment().format('YY-MM-DD HH:mm:ss');

    if (ctx[useProxy]) {
      socket.emit({
        type: 'http',
        date,
        req: {
          method: ctx.method,
          path: ctx.path.replace(/^\/data/g, ''),
          headers: ctx.header,
          body: ctx.request.body,
        },
        res: {
          status: rewriteResponseStatusCode || ctx[proxyResponseStatus],
          host: ctx.host,
          body: ctx.response.body,
          headers: ctx.response.headers,
        },
      });
    } else {
      socket.emit({
        type: 'http',
        date,
        req: {
          method: ctx.method,
          path: ctx.path.replace(/^\/data/g, ''),
          headers: ctx.header,
          body: ctx.request.body,
        },
        res: {
          status: rewriteResponseStatusCode || ctx.status,
          host: ctx.host,
          headers: ctx.response.headers,
          body: ctx.response.body,
        },
      });
    }
  };
};
