'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
  } = app.Sequelize;

  const Group = app.model.define('group', {
    uniqId: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    groupName: {
      type: STRING,
      allowNull: false,
    },
    groupType: {
      type: STRING,
      allowNull: false,
    },
    belongedUniqId: {
      type: STRING,
      allowNull: false,
    },
  }, {
    ...app.config.modelCommonOption,
    indexes: [
      {
        fields: [
          'belongedUniqId',
          'groupType',
          'groupName',
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

  return Group;
};
