function bigint (val) {
  return `${val}::bigint`;
}

function float (val) {
  return `${val}::float`;
}

function varchar (val) {
  return `'${val}'::varchar`;
}

module.exports = {
  bigint,
  float,
  varchar,
};
