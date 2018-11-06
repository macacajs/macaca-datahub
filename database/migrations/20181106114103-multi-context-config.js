'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('interfaces', 'multiContextConfig', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('interfaces', 'multiContextConfig');
  },
};
