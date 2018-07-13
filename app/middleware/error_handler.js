'use strict';

module.exports = (/* options, app */) => {
  return async function errorHandler(ctx, next) {

    // internal server error
    if (!ctx.path.startsWith('/data/')) {
      try {
        return await next();
      } catch (e) {
        ctx.logger.error(e);
        switch (e.name) {
          // uniq index error
          case 'SequelizeUniqueConstraintError':
            ctx.fail(`server error: ${ctx.gettext('SequelizeUniqueConstraintError')}`);
            break;
          default:
            ctx.fail(`server error: ${e.message}`);
        }
        return;
      }
    }

    // datahub interface service error
    try {
      await next();
    } catch (e) {
      ctx.logger.error('[mock] error', e);
      ctx.fail(`config error: ${e.message}`);
    }
  };
};

