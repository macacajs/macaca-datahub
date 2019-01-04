'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize;
    await queryInterface.addColumn('projects', 'globalProxy', {
      type: STRING,
      defaultValue: '',
      allowNull: true,
    });
  },
};
