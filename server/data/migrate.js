const db = require('../lib/db');
const fs = require('fs');

const { MIGRATION_DIR, MIGRATION_REGEX } = require('./constants.js');

async function run () {
  // create migrations table if doesn't exist
  console.log('creating migrations table if does not exist');
  await db.query(
    `CREATE TABLE IF NOT EXISTS migrations (
      id          serial PRIMARY KEY,
      name        varchar(100),
      timestamp   timestamp
    )`);

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
    // filter out migrations previously run
    .filter(({ name }) => !staleMigrations.includes(name))
    // load each migration module
    .map(migration => ({ ...migration, module: require(`${MIGRATION_DIR}/${migration.file}`) }))
    // filter out any migrations without a migrate export
    .filter(migration => typeof migration.module.migrate === 'function')
    // sort by the leading number to ensure proper order of execution
    .sort((a, b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);

  if (!migrations.length) {
    console.log('did not find any unapplied migrations, exiting');
    process.exit();
  }

  console.log(`found ${migrations.length} migrations to run`);
  // start a transaction
  return db.query('BEGIN')
    .then(async () => {
      // finally, lets run the migrations sequentially
      for (let i = 0; i < migrations.length; i++) {
        const migration = migrations[i];
        console.log(`applying migration ${migration.name}`);
        const query = {
          text: `INSERT INTO migrations (name) VALUES ($1)`,
          values: [ migration.name ],
        };
        await migration.module.migrate();


        await db.query(query);
        await console.log(`applied migration ${migration.name}`);
      }
    })
    // if all migrations are successful, let's commit
    .then(() => db.query('COMMIT'))
    .then(() => {
      console.log(`applied ${migrations.length} migrations successfully`);
      process.exit();
    })
    .catch(error => {
      console.error(error);
      console.log('something went wrong, any applied migrations should have been rolled back');
      process.exit(1);
    });
}

(async () => await run())();
