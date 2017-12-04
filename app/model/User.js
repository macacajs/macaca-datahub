'use strict';

module.exports = app => {
  const {
    STRING,
  } = app.Sequelize;

  const User = app.model.define('user', {
    firstName: {
      type: STRING,
    },
  });

  return User;
};
