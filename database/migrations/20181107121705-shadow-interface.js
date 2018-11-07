'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, UUID, UUIDV4, JSON, DATE } = Sequelize;

    await queryInterface.createTable('shadowInterface', {
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
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
