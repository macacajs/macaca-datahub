'use strict';

module.exports = {
  up: async (db) => {
    // clean database dirty data, irreversible
    cleanInterfacesData(db);
    cleanScenesData(db);
    cleanSchemasData(db);

    const transaction = await db.sequelize.transaction();

    try {
      await db.addIndex('interfaces', ['projectUniqId', 'pathname', 'method'], { unique: true }, { transaction });
      await db.addIndex('scenes', ['sceneName', 'interfaceUniqId'], { unique: true }, { transaction });
      await db.addIndex('schemas', ['type', 'interfaceUniqId'], { unique: true }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },

  down: async (db) => {
    const transaction = await db.sequelize.transaction();

    try {
      await db.removeIndex('interfaces', ['projectUniqId', 'pathname', 'method'], { unique: true }, { transaction });
      await db.removeIndex('scenes', ['sceneName', 'interfaceUniqId'], { unique: true }, { transaction });
      await db.removeIndex('schemas', ['type', 'interfaceUniqId'], { unique: true }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
};

function cleanInterfacesData(db) {
  db.sequelize.query(
    'DELETE FROM interfaces WHERE rowid NOT IN (SELECT min(rowid) FROM interfaces GROUP BY projectUniqId, pathname, method);',
  );
}

function cleanScenesData(db) {
  db.sequelize.query(
    'DELETE FROM scenes WHERE rowid NOT IN (SELECT min(rowid) FROM scenes GROUP BY sceneName, interfaceUniqId);',
  );
}

function cleanSchemasData(db) {
  db.sequelize.query(
    'DELETE FROM schemas WHERE rowid NOT IN (SELECT min(rowid) FROM schemas GROUP BY type, interfaceUniqId);',
  );
}
