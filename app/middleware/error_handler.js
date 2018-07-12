'use strict';

module.exports = (/* options, app */) => {
  return async function errorHandler(ctx, next) {
    if (!ctx.path.startsWith('/data/')) {
      try {
        return await next();
      } catch (e) {
        ctx.logger.error(e);
        ctx.fail(`server error: ${e.message}`);
        return;
      }
    }
    try {
      await next();
    } catch (e) {
      ctx.logger.error('[mock] error', e);
      ctx.fail(`datahub config error: ${e.message}`);
    }
  };
};

