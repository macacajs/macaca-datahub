'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    await db.addColumn('interfaces', 'multiCurrentScene', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },

  down: async db => {
    await db.removeColumn('interfaces', 'multiCurrentScene');
  },
};
