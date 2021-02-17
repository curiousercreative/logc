const db = require('../lib/db');
const fs = require('fs');

const { MIGRATION_DIR, MIGRATION_REGEX } = require('./constants.js');

async function run () {
  const migrationsToRollback = process.argv.slice(2);

  if (!migrationsToRollback.length) {
    console.log('no migration names have been supplied as arguments, exiting');
    process.exit();
  }

  // get previously run migrations from migrations table
  console.log('loading previous migrations');
  const staleMigrations = await db.query(`SELECT name FROM migrations`).then(res => res.rows.map(r => r.name));

  // grab all the files in this directory (where we keep migrations)
  console.log('checking for migrations in codebase');
  const migrations = fs.readdirSync(MIGRATION_DIR)
    // filter out files that don't appear to be migrations
    .filter(file => file.match(MIGRATION_REGEX))
    // add the migration name to our data
    .map(file => ({ file, name: file.match(MIGRATION_REGEX)[1] }))
    // filter out migrations not requested for rollback
    .filter(({ file, name }) => migrationsToRollback.includes(name || file))
    // filter to migrations previously run
    .filter(({ name }) => staleMigrations.includes(name))
    // load each migration module
    .map(migration => ({ ...migration, module: require(`${MIGRATION_DIR}/${migration.file}`) }))
    // filter out any migrations without a rollback export
    .filter(migration => typeof migration.module.rollback === 'function')
    // sort by the leading number to ensure proper order of execution
    .sort((a, b) => parseInt(a, 10) < parseInt(b, 10) ? -1 : 1);

  if (!migrations.length) {
    console.log('did not find any applied migrations to rollback, exiting');
    process.exit();
  }

  console.log(`found ${migrations.length} migrations to rollback`);

  // start a transaction
  return db.query('BEGIN')
    .then(async () => {
      // finally, lets run the migrations sequentially
      for (let i = 0; i < migrations.length; i++) {
        const migration = migrations[i];
        console.log(`rolling back migration ${migration.name}`);
        const query = {
          text: `DELETE FROM migrations WHERE name = $1`,
          values: [ migration.name ],
        };

        await migration.module.rollback();
        await db.query(query)
        await console.log(`rolled back migration ${migration.name}`);
      }
    })
    // if all migrations are successful, let's commit
    .then(() => db.query('COMMIT'))
    .then(() => {
      console.log(`rolled back ${migrations.length} migrations successfully`);
      process.exit();
    })
    .catch(error => {
      console.error(error);
      console.log('something went wrong, any rolled back migrations should have been reapplied');
      process.exit(1);
    });
}

(async () => await run())();
