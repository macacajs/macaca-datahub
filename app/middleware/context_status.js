'use strict';

const status = Symbol.for('context#rewriteResponseStatus');

module.exports = () => {
  return async function contextStatus(ctx, next) {
    await next();
    const statusCode = !isNaN(ctx[status]) && parseInt(ctx[status], 10);
    if (statusCode) {
      ctx.set('x-datahub-response-status', statusCode);
      ctx.set('x-datahub-realstatus', ctx.status);
      ctx.realStatus = 200;
      ctx.status = statusCode;
    }
  };
};
