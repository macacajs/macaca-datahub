'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING, UUID, UUIDV4, DATE } = Sequelize;
    const transaction = await db.sequelize.transaction();

    try {
      await db.createTable(
        'groups',
        {
          uniqId: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          groupName: {
            type: STRING,
            allowNull: false,
          },
          groupType: {
            type: STRING,
            allowNull: false,
          },
          belongedUniqId: {
            type: STRING,
            allowNull: false,
          },
          createdAt: {
            type: DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DATE,
            allowNull: false,
          },
        },
        {
          indexes: [
            {
              fields: ['uniqId'],
              unique: true,
            },
          ],
        },
        { transaction },
      );

      await db.addColumn(
        'interfaces',
        'groupUniqId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

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

  down: async (db) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.dropTable('groups', { transaction });
      await db.removeColumn('interfaces', 'groupUniqId', { transaction });
      await db.removeColumn('scenes', 'groupUniqId', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
