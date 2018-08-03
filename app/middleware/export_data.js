'use strict';

module.exports = (/* options, app */) => {
  return async function exportData(ctx, next) {
    await next();
    await ctx.service.database.exportData();
  };
};
