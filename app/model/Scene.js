'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
    JSON,
  } = app.Sequelize;

  const Scene = app.model.define('scene', {
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
  }, {
    ...app.config.modelCommonOption,
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

  return Scene;
};
