'use strict';

module.exports = {
  up: async (db) => {
    const transaction = await db.sequelize.transaction();
    try {
      await db.addIndex('groups', ['belongedUniqId', 'groupType', 'groupName'], { unique: true }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },

  down: async (db) => {
    const transaction = await db.sequelize.transaction();
    try {
      await db.removeIndex('groups', ['belongedUniqId', 'groupType', 'groupName'], { unique: true }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
