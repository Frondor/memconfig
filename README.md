# merge-files-content [![Build Status](https://travis-ci.com/Frondor/merge-files-content.svg?branch=master)](https://travis-ci.com/Frondor/merge-files-content) [![codecov](https://codecov.io/gh/Frondor/merge-files-content/branch/master/graph/badge.svg)](https://codecov.io/gh/Frondor/merge-files-content)

Node.JS utility function to recursively load multiple directories and files as one. Useful for project-wide configuration files

## Table of contents

1. [Installation](#installation)
2. [Usage](#usage)
2. [API](#api)

## Installation

```
npm i merge-files-content
```
or

```
yarn add merge-files-content
```

## Usage

This module exports a single function which receives two arguments: the file(s) and/or directories full paths, and a (optional) settings object.

### Example

Let's say we have a `src/config` directory with 3 files exporting objects:
  - /database.js
  - /storage.json
  - /nested/file.js

> **Note:** In this case we have `.js` and `.json` files, but you can use any file extension as long as its supported by `require()`.
>
> If the directory contains unsupported module types, the program shall crash.

```js
/**
 * /src/config/database.js
 */
module.exports = {
  PORT: 3000
}
```
_/src/config/storage.json_
```json
{
  "driver": "s3"
}
```

```js
/**
 * /src/config/database.js
 */
module.exports = 'Hello World!'
```

```js
/**
 * /index.js
 */
const mfc = require('merge-files-content');
const path = require('path');

const config = mfc(path.resolve('src/config'));

config.database.PORT // 3000
config.storage.driver // s3
config.nested.file // Hello World!
```

## API

```ts
mfc(AbsolutePaths, MfcSettings?): Object
```

### AbsolutePaths

Either a single or an array of absolute paths. They can point either to a file, a dir, or a mix of boths.

### MfcSettings

An optional object of settings

#### MfcSettings.useFilenames (default: true)

When `true`, the file exported contents will live under a key (namespace) equal to the camelCased version of the file name (without its extension).

> **Note**: this option is ignored if you're loading a single **file** instead of a directory. In that case, mfc behaves just like `require()`.

#### MfcSettings.maxDepth (default: 3)

The max level of deepness you want the script to look for files.

