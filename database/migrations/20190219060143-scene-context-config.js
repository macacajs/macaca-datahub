'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { JSON } = Sequelize;
    const transaction = await db.sequelize.transaction();

    try {
      await db.addColumn(
        'scenes',
        'contextConfig',
        {
          type: JSON,
          defaultValue: {},
          allowNull: false,
        },
        { transaction },
      );
      await db.removeColumn('interfaces', 'contextConfig', { transaction });
      await db.removeColumn('shadowInterfaces', 'contextConfig', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },

  down: async (db) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.removeColumn('scenes', 'contextConfig', { transaction });
      await db.addColumn(
        'interfaces',
        'contextConfig',
        {
          type: JSON,
          defaultValue: {},
          allowNull: false,
        },
        { transaction },
      );
      await db.addColumn(
        'shadowInterfaces',
        'contextConfig',
        {
          type: JSON,
          defaultValue: {},
          allowNull: false,
        },
        { transaction },
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
