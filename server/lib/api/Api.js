const { curry, exists } = require('functional.js');

class Api {
  static model;

  static delete (params) {

  }

  static get (params) {
    return this.model.get(params);
  }

  static patch (params, body) {
    return this.model.update(body, params)
      .then(() => this.model.expireCache(params.id));
  }

  static post (params, body) {
    return this.model.create(body, params)
      .then(() => this.model.expireCache(params.id));
  }

  static put (params, body) {
    return this.model.update(body, params)
      .then(() => this.model.expireCache(params.id));
  }

  static handleRoute (req, res) {
    // clean params of empty values
    const params = Object
      .fromEntries(Object
        .entries(req.params)
        .filter(([ key, val ]) => exists(val))
      );

    if (req.method.toLowerCase() in this) {
      return this[req.method.toLowerCase()](params, req.body)
        .then(body => res.json(body))
        .catch(this.send500(res));
    }
  }

  static send404 (res) {
    return Promise.resolve()
      .then(() => res.status(404).send('not found'));
  }

  static send500 = curry((res, error) => {
    res.status(500).send(`something went wrong \n ${error}`);
  });
}

module.exports = Api;
