'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
    JSON,
  } = app.Sequelize;

  const Interface = app.model.define('interface', {
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
      defaultValue: 'default',
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
  }, {
    ...app.config.modelCommonOption,
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

  return Interface;
};
