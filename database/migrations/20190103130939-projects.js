'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING } = Sequelize;
    const transaction = await db.sequelize.transaction();

    try {
      await db.addColumn(
        'projects',
        'globalProxy',
        {
          type: STRING,
          defaultValue: '',
          allowNull: true,
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
      await db.removeColumn('projects', 'globalProxy', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
