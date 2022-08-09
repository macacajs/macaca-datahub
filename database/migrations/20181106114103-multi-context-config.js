'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.addColumn(
        'interfaces',
        'multiContextConfig',
        {
          type: Sequelize.JSON,
          defaultValue: {},
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },

  down: async (db) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.removeColumn('interfaces', 'multiContextConfig', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
