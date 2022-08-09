'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING } = Sequelize;
    const transaction = await db.sequelize.transaction();

    try {
      await db.addColumn(
        'scenes',
        'format',
        {
          type: STRING,
          defaultValue: 'json',
          allowNull: false,
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
      await db.removeColumn('scenes', 'format', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
