'use strict';

const _ = require('xutil');
const path = require('path');
const chalk = require('chalk');
const Sequelize = require('sequelize');

module.exports = app => {
  const tempDir = path.join(app.config.HOME, `.${app.config.pkg.name}`);
  const storageDir = process.env.DATAHUB_STORE_PATH || path.join(tempDir, `common-${app.config.pkg.name}.data`);

  _.mkdir(path.dirname(storageDir))

  delete process.env.DATAHUB_STORE_PATH;

  app.logger.info(`${chalk.cyan('launch datahub store at:')} ${storageDir}`);

  const sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: storageDir,
    logging: false,
  });

  const UserModel = sequelize.define('user', {
    firstName: {
      type: Sequelize.STRING,
    },
  });

  const ProjectModel = sequelize.define('project', {
    identifer: {
      type: Sequelize.STRING,
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
    },
  });

  const DataModel = sequelize.define('data', {
    identifer: {
      type: Sequelize.STRING,
    },
    pathname: {
      type: Sequelize.STRING,
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
    },
    method: {
      type: Sequelize.STRING,
      defaultValue: 'ALL',
      allowNull: true,
    },
    currentScene: {
      type: Sequelize.STRING,
      defaultValue: 'default',
      allowNull: true,
    },
    params: {
      type: Sequelize.STRING,
      defaultValue: '[]',
      allowNull: true,
    },
    scenes: {
      type: Sequelize.STRING,
      defaultValue: '[]',
      allowNull: true,
    },
    delay: {
      type: Sequelize.STRING,
      defaultValue: '0',
      allowNull: true,
    },
  });

  sequelize.sync();

  app.UserModel = UserModel;
  app.ProjectModel = ProjectModel;
  app.DataModel = DataModel;
};
