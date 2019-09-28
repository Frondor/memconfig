const Config = require('./Config');
const FileSystemLoader = require('./loaders/FileSystemLoader');

const restoreModule = () => (module.exports = imports);

/**
 * Overrides module.exports with an instance of Config, useful for short application-wide importing
 * Use it at your own risk
 *
 * ⚠️ This method overrides the whole module export!
 * @param {ConfigSettings} settings
 * @return {Config}
 */
const makeSingleton = (settings) => {
  // todo podría ser clase o function "singletonable" para otros paquetes
  const config = new Config(settings);
  module.exports = config;
  module.exports.restoreModule = restoreModule;
  return config;
};

const imports = {
  Config,
  FileSystemLoader,
  makeSingleton
};

restoreModule();
