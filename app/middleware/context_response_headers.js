'use strict';

const responseHeaders = Symbol.for('context#rewriteResponseHeaders');

module.exports = () => {
  return async function contextResponseHeaders(ctx, next) {
    await next();
    const headers = ctx[responseHeaders];
    const headerSet = [];
    if (headers && typeof headers === 'object') {
      for (const key in headers) {
        ctx.set(key, headers[key]);
        headerSet.push(key);
      }
      headerSet.length && ctx.set('x-datahub-custom-response-headers',
        headerSet.join(','));
    }
  };
};
