'use strict';

module.exports = () => {
  return async function cors(ctx, next) {
    const origin = ctx.get('origin');
    if (!origin) {
      return await next();
    }

    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Credentials', 'true');

    if (ctx.method !== 'OPTIONS') {
      return await next();
    }

    // preflight OPTIONS request
    ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
    ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
    ctx.set('Access-Control-Max-Age', 10 * 60 * 1000);
    ctx.status = 204;
  };
};
