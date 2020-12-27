'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    await db.addColumn('interfaces', 'multiContextConfig', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },

  down: async db => {
    await db.removeColumn('interfaces', 'multiContextConfig');
  },
};
