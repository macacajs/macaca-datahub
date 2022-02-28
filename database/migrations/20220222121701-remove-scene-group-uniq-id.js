'use strict';

module.exports = {
  up: async db => {
    await db.removeColumn('scenes', 'groupUniqId');
  },

  down: async (db, Sequelize) => {
    await db.addColumn('scenes', 'groupUniqId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
