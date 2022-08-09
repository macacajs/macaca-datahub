'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING, UUID, UUIDV4, JSON, DATE } = Sequelize;
    const transaction = await db.sequelize.transaction();

    try {
      await db.createTable(
        'shadowInterfaces',
        {
          tagName: {
            type: STRING,
            allowNull: false,
          },
          originInterfaceId: {
            type: STRING,
            allowNull: false,
          },
          currentScene: {
            type: STRING,
            defaultValue: '',
            allowNull: false,
          },
          contextConfig: {
            type: JSON,
            defaultValue: {},
            allowNull: false,
          },
          uniqId: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          createdAt: {
            type: DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DATE,
            allowNull: false,
          },
        },
        {
          indexes: [
            {
              fields: ['uniqId'],
              unique: true,
            },
          ],
        },
        { transaction },
      );
      await db.removeColumn('interfaces', 'multiCurrentScene', { transaction });
      await db.removeColumn('interfaces', 'multiContextConfig', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },

  down: async (db, Sequelize) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.dropTable('shadowInterfaces', { transaction });
      await db.addColumn(
        'interfaces',
        'multiCurrentScene',
        {
          type: Sequelize.JSON,
          defaultValue: {},
        },
        { transaction },
      );
      await db.addColumn(
        'interfaces',
        'multiContextConfig',
        {
          type: Sequelize.JSON,
          defaultValue: {},
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};
