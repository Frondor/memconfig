const path = require('path');
const fs = require('fs');
const { set } = require('lodash');
const Loader = require('./Loader');

const fileRegExp = new RegExp('(.js|.json)$');
const isFile = (fileName) => fileRegExp.test(fileName);

const setIn = (rootDir, filePath, store) => {
  const value = require(filePath);
  const keyPath = filePath
    .replace(rootDir, '') // remove base path
    .replace(fileRegExp, '') // remove file extensions
    .split(path.sep) // split by the OS separator
    .filter((v) => v); // clear empty strings

  return set(store, keyPath, value);
};

/**
 * Recursively load modules into a hash of namespaces, by file paths
 * @param {String} currentDir base path where
 * @param {String} rootDir
 * @param {Object} contents
 * @return {*}
 */
const readdirContents = (currentDir, rootDir = currentDir, contents = {}) =>
  fs.readdirSync(currentDir).reduce((tree, node) => {
    // If current file is this same file, continue
    // if (path.join(__dirname, node) === __filename) return tree; // no corre mas
    const currentPath = path.join(currentDir, node);
    if (isFile(node)) return setIn(rootDir, currentPath, tree);
    return readdirContents(currentPath, rootDir, contents);
  }, contents);

module.exports = class FileSystemLoader extends Loader {
  /**
   * @return {String[]}
   */
  get directories() {
    return this.settings.directories || [process.cwd()];
  }

  /**
   * @return {*}
   */
  load() {
    return this.directories.reduce(
      (store, currentDir) => readdirContents(currentDir, undefined, store),
      {}
    );
  }
};
