'use strict';

module.exports = app => {
  const {
    STRING,
  } = app.Sequelize;

  const Data = app.model.define('data', {
    identifer: {
      type: STRING,
    },
    pathname: {
      type: STRING,
      unique: true,
    },
    description: {
      type: STRING,
    },
    method: {
      type: STRING,
      defaultValue: 'ALL',
      allowNull: true,
    },
    currentScene: {
      type: STRING,
      defaultValue: 'default',
      allowNull: true,
    },
    proxyContent: {
      type: STRING,
      defaultValue: '{}',
      allowNull: true,
    },
    params: {
      type: STRING,
      defaultValue: '{}',
      allowNull: true,
    },
    scenes: {
      type: STRING,
      defaultValue: '[]',
      allowNull: true,
    },
    delay: {
      type: STRING,
      defaultValue: '0',
      allowNull: true,
    },
  });

  return Data;
};
