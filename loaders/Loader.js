/**
 * load
 */
class Loader {
  /**
   * asd
   * @param {*} settings
   */
  constructor(settings = {}) {
    this.settings = settings;

    if (this.constructor.name === Loader.name) {
      throw new TypeError('Can not instantiate abstract class');
    }
  }

  /**
   * Load
   */
  load() {
    throw new TypeError('Method "load" must be implemented');
  }
}

module.exports = Loader;
