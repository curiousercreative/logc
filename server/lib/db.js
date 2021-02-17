const { Client } = require('pg');

// TODO: figure out storage of environment config
const client = new Client({
  user: 'user',
  host: 'db',
  database: 'logc',
  password: 'password',
});

// wait for a db connection
(async () => await client.connect())();

module.exports = client;
