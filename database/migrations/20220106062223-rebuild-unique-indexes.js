'use strict';

module.exports = {
  up: async db => {
    // clean database dirty data, irreversible
    cleanInterfacesData(db);
    cleanScenesData(db);
    cleanSchemasData(db);

    await db.addIndex('interfaces', [ 'projectUniqId', 'pathname', 'method' ], { unique: true });
    await db.addIndex('scenes', [ 'sceneName', 'interfaceUniqId' ], { unique: true });
    await db.addIndex('schemas', [ 'type', 'interfaceUniqId' ], { unique: true });
  },

  down: async db => {
    await db.removeIndex('interfaces', [ 'projectUniqId', 'pathname', 'method' ], { unique: true });
    await db.removeIndex('scenes', [ 'sceneName', 'interfaceUniqId' ], { unique: true });
    await db.removeIndex('schemas', [ 'type', 'interfaceUniqId' ], { unique: true });
  },
};

function cleanInterfacesData(db) {
  db.sequelize.query(
    'DELETE FROM interfaces WHERE rowid NOT IN (SELECT min(rowid) FROM interfaces GROUP BY projectUniqId, pathname, method);'
  );
}

function cleanScenesData(db) {
  db.sequelize.query(
    'DELETE FROM scenes WHERE rowid NOT IN (SELECT min(rowid) FROM scenes GROUP BY sceneName, interfaceUniqId);'
  );
}

function cleanSchemasData(db) {
  db.sequelize.query(
    'DELETE FROM schemas WHERE rowid NOT IN (SELECT min(rowid) FROM schemas GROUP BY type, interfaceUniqId);',
  );
}
