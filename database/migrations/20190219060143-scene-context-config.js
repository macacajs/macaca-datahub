'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { JSON } = Sequelize;
    await db.addColumn('scenes', 'contextConfig', {
      type: JSON,
      defaultValue: {},
      allowNull: false,
    });
    await db.removeColumn('interfaces', 'contextConfig');
    await db.removeColumn('shadowInterfaces', 'contextConfig');
  },

  down: async db => {
    await db.removeColumn('scenes', 'contextConfig');
    await db.addColumn('interfaces', 'contextConfig', {
      type: JSON,
      defaultValue: {},
      allowNull: false,
    });
    await db.addColumn('shadowInterfaces', 'contextConfig', {
      type: JSON,
      defaultValue: {},
      allowNull: false,
    });
  },
};

