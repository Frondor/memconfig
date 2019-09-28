const Store = require('./Store');

/**
 * Config manager
 */
class Config {
  // todo - extends Storage (InMemoryStorage, FileStorage, AsyncStorage, LocalStorage?)
  /**
   * @param {Object} settings
   */
  constructor(settings = {}) {
    const { store, loader } = settings;
    this.loader = loader;
    this.setStore(store);
  }

  /**
   * Use the loader to create the config store
   */
  async load() {
    if (!this.loader) throw new ReferenceError('This config has no loader');
    return this.setStore(await this.loader.load());
  }

  /**
   * @param {*} store
   * @return {this}
   */
  setStore(store = {}) {
    this.store = new Store(store);
    return this;
  }

  /**
   * Get a value in specified path of the config store
   * @param {String|String[]} pathLike
   * @param {*} defaultValue
   * @return {*}
   */
  get(pathLike, defaultValue) {
    return this.store.get(pathLike, defaultValue);
  }

  /**
   * Set a value in the store to the specified path
   * @param {String|String[]} pathLike
   * @param {*} value
   * @return {*}
   */
  set(pathLike, value) {
    this.store.set(pathLike, value);
    return this;
  }
}

module.exports = Config;
