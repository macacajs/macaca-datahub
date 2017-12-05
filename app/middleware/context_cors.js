'use strict';

module.exports = () => {
  return async function cors(ctx, next) {
    await next();
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Origin', ctx.get('origin'));
  };
};
