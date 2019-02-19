'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { JSON } = Sequelize;
    await queryInterface.addColumn('scenes', 'contextConfig', {
      type: JSON,
      defaultValue: {},
      allowNull: false,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('interfaces', 'contextConfig');
    await queryInterface.removeColumn('shadowInterfaces', 'contextConfig');
  },
};

