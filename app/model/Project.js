'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
  } = app.Sequelize;

  const Project = app.model.define('project', {
    projectName: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: STRING,
      allowNull: false,
    },
    globalProxy: {
      type: STRING,
      allowNull: true,
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

  return Project;
};
