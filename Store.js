const { get, set } = require('lodash');

class Store {
  constructor(store = {}) {
    this._store = store;
  }

  getStore() {
    return this._store;
  }

  get(pathLike, defaultValue) {
    return get(this._store, pathLike, defaultValue);
  }

  set(pathLike, value) {
    set(this._store, pathLike, value);
  }
}

module.exports = Store;
