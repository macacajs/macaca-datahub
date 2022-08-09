'use strict';

module.exports = {
  up: async (db) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.removeColumn('scenes', 'groupUniqId', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },

  down: async (db, Sequelize) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.addColumn(
        'scenes',
        'groupUniqId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
