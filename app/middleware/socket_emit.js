'use strict';

const _ = require('xutil');

const useProxy = Symbol.for('context#useProxy');
const statusCode = Symbol.for('context#statusCode');
const proxyResponse = Symbol.for('context#proxyResponse');
const proxyResponseStatus = Symbol.for('context#proxyResponseStatus');

const socket = require('../socket');

module.exports = () => {
  return async function socketEmit(ctx, next) {
    await next();

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
          status: ctx[proxyResponseStatus],
          host: ctx.host,
          body: ctx.body,
        },
        proxyResponse: ctx[proxyResponse],
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
          status: ctx[statusCode],
          host: ctx.host,
          headers: ctx.response.headers,
          body: ctx.body,
        },
      });

    }
  };
};
