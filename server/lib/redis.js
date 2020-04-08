const redis = require('redis');

const REDIS_CONFIG = { host: 'redis' };

module.exports = {
  client: redis.createClient(REDIS_CONFIG),
  subscriber: redis.createClient(REDIS_CONFIG),
};
