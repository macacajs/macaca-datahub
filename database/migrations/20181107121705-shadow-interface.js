'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, UUID, UUIDV4, JSON, DATE } = Sequelize;

    await queryInterface.createTable('shadowInterfaces', {
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
    await queryInterface.addIndex('shadowInterfaces', [ 'tagName', 'originInterfaceId' ]);
    await queryInterface.removeColumn('interfaces', 'multiCurrentScene');
    await queryInterface.removeColumn('interfaces', 'multiContextConfig');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('shadowInterfaces', [ 'tagName', 'originInterfaceId' ]);
    await queryInterface.dropTable('shadowInterfaces');
    await queryInterface.addColumn('interfaces', 'multiCurrentScene', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
    await queryInterface.addColumn('interfaces', 'multiContextConfig', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },
};
