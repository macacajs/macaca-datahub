'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING, UUID, UUIDV4, JSON, DATE } = Sequelize;

    await db.createTable('shadowInterfaces', {
      tagName: {
        type: STRING,
        allowNull: false,
      },
      originInterfaceId: {
        type: STRING,
        allowNull: false,
      },
      currentScene: {
        type: STRING,
        defaultValue: '',
        allowNull: false,
      },
      contextConfig: {
        type: JSON,
        defaultValue: {},
        allowNull: false,
      },
      uniqId: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
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
    await db.removeColumn('interfaces', 'multiCurrentScene');
    await db.removeColumn('interfaces', 'multiContextConfig');
  },

  down: async (db, Sequelize) => {
    await db.dropTable('shadowInterfaces');
    await db.addColumn('interfaces', 'multiCurrentScene', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
    await db.addColumn('interfaces', 'multiContextConfig', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },
};
