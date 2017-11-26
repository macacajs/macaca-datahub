'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');
const chalk = require('chalk');
const Sequelize = require('sequelize');

module.exports = app => {
  const homePath = path.join(app.config.HOME, `.${app.config.pkg.name}`);
  const storageDir = path.join(homePath, `${app.config.name}.${app.config.env}.data`);

  _.mkdir(path.dirname(storageDir));

  app.logger.info(`${chalk.cyan('launch datahub at:')} ${storageDir}`);

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

  if (process.env.DATAHUB_STORE_PATH) {
    const storeDir = path.resolve(process.env.DATAHUB_STORE_PATH);

    if (_.isExistedDir(storeDir)) {
      app.config.dataHubStoreDir = storeDir;
    }
  }

  app.beforeStart(async () => {

    if (!app.config.dataHubStoreDir) {
      return;
    }

    app.logger.info(`${chalk.cyan('launch datahub store at:')} ${app.config.dataHubStoreDir}`);

    const hubFile = path.resolve(app.config.dataHubStoreDir, 'hub.data');

    if (_.isExistedFile(hubFile)) {

      app.logger.info(`${chalk.cyan('import datahub from:')} ${hubFile}`);

      const content = fs.readFileSync(hubFile, 'utf8');

      try {
        const list = JSON.parse(content);

        for (let i = 0; i < list.length; i++) {
          const data = list[i];
          const {
            identifer,
          } = data;
          await app.ProjectModel.upsert({
            ...data,
          }, {
            where: {
              identifer,
            },
          });
        }
      } catch (e) {
        app.logger.warn(e.message);
      }
    }

    const archiveFile = path.resolve(app.config.dataHubStoreDir, 'archive.data');

    if (_.isExistedFile(archiveFile)) {

      app.logger.info(`${chalk.cyan('import datahub from:')} ${archiveFile}`);
      const content = fs.readFileSync(archiveFile, 'utf8');

      try {
        const list = JSON.parse(content);

        for (let i = 0; i < list.length; i++) {
          const data = list[i];
          const {
            identifer,
            pathname,
          } = data;
          await app.DataModel.upsert({
            ...data,
          }, {
            where: {
              identifer,
              pathname,
            },
          });
        }
      } catch (e) {
        app.logger.warn(e.message);
      }
    }
  });
};

