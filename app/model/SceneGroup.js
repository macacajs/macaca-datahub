'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
    JSON,
    BOOLEAN,
  } = app.Sequelize;

  const SceneGroup = app.model.define('sceneGroup', {
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
  }, {
    ...app.config.modelCommonOption,
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

  return SceneGroup;
};
