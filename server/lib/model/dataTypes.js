function bigint (val) {
  return `${val}::bigint`;
}

function varchar (val) {
  return `'${val}'::varchar`;
}

module.exports = {
  bigint,
  varchar,
};
