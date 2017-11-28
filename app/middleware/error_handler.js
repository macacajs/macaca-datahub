'use strict';

module.exports = (/* options, app */) => {
  return async function errorHandler(ctx, next) {
    if (!ctx.path.startsWith('/data/')) {
      return await next();
    }
    try {
      await next();
    } catch (e) {
      ctx.logger.error('[mock] error', e);
      ctx.body = {
        success: false,
        message: 'datahub config error',
      };
    }
  };
};
