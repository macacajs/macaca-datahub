'use strict';

module.exports = (/* options, app */) => {
  return async function exportData(ctx, next) {
    await next();
    // delete await to export data with async.
    ctx.service.database.exportData();
  };
};
