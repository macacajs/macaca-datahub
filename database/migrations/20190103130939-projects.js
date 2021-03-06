'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING } = Sequelize;
    await db.addColumn('projects', 'globalProxy', {
      type: STRING,
      defaultValue: '',
      allowNull: true,
    });
  },
  down: async db => {
    await db.removeColumn('projects', 'globalProxy');
  },
};
