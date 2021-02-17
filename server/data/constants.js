const MIGRATION_DIR = `${__dirname}/migrations`;
const MIGRATION_REGEX = /^([0-9]{4}_[a-zA-Z0-9]+)\.js$/;

module.exports = {
  MIGRATION_DIR,
  MIGRATION_REGEX,
}
