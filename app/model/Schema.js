'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
    JSON,
  } = app.Sequelize;

  const Schema = app.model.define('schema', {
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
  }, {
    ...app.config.modelCommonOption,
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

  return Schema;
};
