const Api = require('../lib/api/Api.js');
const Row = require('../models/Row.js');

class RowApi extends Api {
  static model = Row;
}

module.exports = RowApi;
