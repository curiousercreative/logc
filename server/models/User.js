const { dataTypes, Model } = require('../lib/model');

class User extends Model {
  static cacheKey = 'user';
  static dbFields = [
    [ 'id', dataTypes.bigint ],
    [ 'handle', dataTypes.varchar ],
    [ 'superuser', dataTypes.bigint ],
    [ 'created', dataTypes.bigint ],
  ];
  static dbFrom = 'users';
}

module.exports = User;
