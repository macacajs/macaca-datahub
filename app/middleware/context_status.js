'use strict';

const status = Symbol.for('context#status');

module.exports = () => {
  return async function contextStatus(ctx, next) {
    await next();
    const statusCode = !isNaN(ctx[status]) && parseInt(ctx[status], 10);
    if (statusCode) {
      ctx.set('x-datahub-status', statusCode);
      ctx.set('x-datahub-realstatus', '200');
      ctx.realStatus = 200;
      ctx.status = statusCode;
    }
  };
};
