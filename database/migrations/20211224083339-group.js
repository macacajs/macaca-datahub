'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING, UUID, UUIDV4, DATE } = Sequelize;

    await db.createTable('groups', {
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
    }, {
      indexes: [
        {
          fields: [
            'uniqId',
          ],
          unique: true,
        },
      ],
    });

    await db.addColumn('interfaces', 'groupUniqId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await db.addColumn('scenes', 'groupUniqId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async db => {
    await db.dropTable('groups');
    await db.removeColumn('interfaces', 'groupUniqId');
    await db.removeColumn('scenes', 'groupUniqId');
  },
};
