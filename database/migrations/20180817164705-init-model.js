'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING, UUID, UUIDV4, JSON, DATE } = Sequelize;
    await db.createTable('projects', {
      projectName: {
        type: STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: STRING,
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
            'projectName',
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

    await db.createTable('interfaces', {
      protocol: {
        type: STRING,
        defaultValue: 'http',
        allowNull: false,
      },
      pathname: {
        type: STRING,
        allowNull: false,
      },
      method: {
        type: STRING,
        defaultValue: 'GET',
        allowNull: false,
      },
      projectUniqId: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: STRING,
        allowNull: false,
      },
      currentScene: {
        type: STRING,
        defaultValue: '',
        allowNull: false,
      },
      proxyConfig: {
        type: JSON,
        defaultValue: {},
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
            'projectUniqId',
            'pathname',
            'method',
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

    await db.createTable('scenes', {
      sceneName: {
        type: STRING,
        allowNull: false,
      },
      data: {
        type: JSON,
        defaultValue: {},
        allowNull: false,
      },
      interfaceUniqId: {
        type: STRING,
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
            'sceneName',
            'interfaceUniqId',
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

    await db.createTable('schemas', {
      type: {
        type: STRING,
        allowNull: false,
      },
      data: {
        type: JSON,
        allowNull: false,
        defaultValue: {},
      },
      interfaceUniqId: {
        type: STRING,
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
            'type',
            'interfaceUniqId',
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

  down: async db => {
    await db.dropTable('interfaces');
    await db.dropTable('projects');
    await db.dropTable('scenes');
    await db.dropTable('schemas');
  },
};
