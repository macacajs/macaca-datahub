'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING } = Sequelize;
    await db.addColumn('scenes', 'format', {
      type: STRING,
      defaultValue: 'json',
      allowNull: false,
    });
  },

  down: async db => {
    await db.removeColumn('scenes', 'format');
  },
};
