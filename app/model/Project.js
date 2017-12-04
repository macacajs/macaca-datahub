'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const Project = app.model.define('project', {
    identifer: {
      type: STRING,
      unique: true,
    },
    description: {
      type: STRING,
    },
  });

  return Project;
};
