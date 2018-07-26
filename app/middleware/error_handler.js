'use strict';

module.exports = (/* options, app */) => {
  return async function errorHandler(ctx, next) {

    // internal server error
    if (!ctx.path.startsWith('/data/')) {
      try {
        await next();
      } catch (e) {
        ctx.logger.error('[internal error]', e);
        switch (e.name) {
          // uniq index error
          case 'SequelizeUniqueConstraintError':
            ctx.fail(`server error: ${ctx.gettext('SequelizeUniqueConstraintError')}`);
            break;
          default:
            ctx.fail(`server error: ${e.message}`);
        }
      }
      return;
    }

    // datahub /data/ service error
    try {
      await next();
    } catch (e) {
      ctx.logger.error('[datahub error]', e);
      ctx.fail(`config error: ${e.message}`);
    }
  };
};

