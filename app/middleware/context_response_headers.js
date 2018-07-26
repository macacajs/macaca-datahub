'use strict';

const responseHeaders = Symbol.for('context#rewriteResponseHeaders');

module.exports = () => {
  return async function contextResponseHeaders(ctx, next) {
    await next();
    const headers = ctx[responseHeaders];
    if (headers && typeof headers === 'object') {
      ctx.set('x-datahub-response-headers',
        Object.keys(headers).join(','));
      for (const key in headers) {
        ctx.set(key, headers[key]);
      }
    }
  };
};
