class Api {
  static model;

  static delete (params) {

  }

  static get (params) {
    return this.model.get(params);
  }

  static patch (params, body) {
    return this.model.update(body, params);
  }

  static post (params, body) {
    return this.model.create(body, params);
  }

  static put (params, body) {
    return this.model.update(body, params);
  }
}

module.exports = Api;
