'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
  } = app.Sequelize;

  const ShadowInterface = app.model.define('shadowInterface', {
    tagName: {
      type: STRING,
      defaultValue: '',
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
          'uniqId',
        ],
        unique: true,
      },
    ],
  });

  return ShadowInterface;
};
