'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, UUID, UUIDV4, JSON, BOOLEAN, DATE } = Sequelize;

    await queryInterface.createTable('sceneGroups', {
      sceneGroupName: {
        type: STRING,
        allowNull: false,
      },
      projectUniqId: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: STRING,
        allowNull: true,
      },
      interfaceList: {
        type: JSON,
        defaultValue: [],
        allowNull: false,
      },
      uniqId: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      enable: {
        type: BOOLEAN,
        defaultValue: false,
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
            'projectUniqId',
            'sceneGroupName',
          ],
          unique: true,
        },
        {
          fields: [
            'uniqId',
          ],
          unique: true,
        },
      ],
    });
  },

  down: async queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('sceneGroups');
  },
};
