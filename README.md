# memconfig

[![npm version](https://badgen.net/npm/v/memconfig)](https://www.npmjs.com/package/memconfig)
[![minzipped size](https://badgen.net/bundlephobia/minzip/memconfig)](https://bundlephobia.com/result?p=memconfig)
[![build status](https://travis-ci.com/Frondor/memconfig.svg?branch=master)](https://travis-ci.com/Frondor/memconfig)
[![codecov](https://codecov.io/gh/Frondor/memconfig/branch/master/graph/badge.svg)](https://codecov.io/gh/Frondor/memconfig)
![types included](https://badgen.net/npm/types/memconfig)

<hr>

Manage project-wide configuration from an immutable in-memory store, using a friendly interface powered by lodash's get/set path-like selectors.

## Table of contents

1. [Motivation](#motivation)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API](#api)
5. [Best practices](#best-practices)

## Motivation

I find myself writing the same module in different projects, and the libraries I found are overkill for what I need, so I decided to distribute it as a small package.

And it goes pretty well with [merge-files-content](https://www.npmjs.com/package/merge-files-content) Node.JS module!

## Installation

Before installing, you need to install [lodash](https://lodash.com/) by yourself, since it's a peerDependency.

In case your project doesn't already uses it, run `npm i lodash`.

```
npm i memconfig
```

or

```
yarn add memconfig
```

## Usage

This module works both in the browser and Node.JS environments. Let's see some examples:

#### Database configs in Node

```js
const { Config } = require('memconfig')

const config = new Config()
config.set('database.port', 3001)
config.get('database').port === 3001 // true
config.get(['database', 'host'], 'default-host') // "default-host"
```

### User UI (serializable) settings in the browser

```js
import { Config } from 'memconfig' // es6 supported!

const config = new Config()
// user enables dark mode
config.set('userSettings.darkMode', true)

// Then you have to persist local settings
localStorage.setItem('ui_config', config.toString())
// The config can be deserialized with the from() method
const config = Config.from(localStorage.getItem('ui_config'))
config.get('userSettings') // {"darkMode": true}
```

## API

### 🔧 `Config`

The `Config` objects accepts an object of settings:

```js
new Config({
  /**
   * If true, every object is going to be clonned in order
   * to prevent side-effect mutations
   */
  immutable: true,
})
```

### 🔧 `config.setStore(store)`

Use `config.setStore(yourOwnObject)` to initialize it with your app defaults.

### 🔧 `config.freeze()`

Freeze the Config instance and prevent new values to be inserted into the store. It shall throw an `Error` if `config.set()` is called while `config.frozen` is `true`.

Use `config.unfreeze()` to unfreeze.

> ⚠️ For Node.JS, it is advisable to use this method once your app starts if you're clustering it, to ensure that nobody tries to mutate configurations at runtime.

### 🔧 `config.get(valuePath, defaultValue)`

Internally it uses lodash's [get](https://lodash.com/docs/#get) to resolve `valuePath` keys.

### 🔧 `config.set(valuePath, value)`

Internally it uses lodash's [set](https://lodash.com/docs/#set).

### 🔧 `config.merge(obj | Config)`

Merges the given object (or instance of `Config`) into the store.

### 🔧 `config.delete(valuePath)`

Internally it uses lodash's [unset](https://lodash.com/docs/#set).

### 🔧 `config.toString()`

Same as doing `JSON.stringify(config.store)`.

### 🔧 `Config.from(serializedStore, configSettings)`

Static method to create an instance of `Config` out of a "stringified" store.

Accepts a second parameter to pass settings to the constructor.

## Best practices

### 💎 Don't overuse `get` and `set` methods; "get once"

As simple as setting object properties should be, **these methods are not linear**. That means your program will iterate over many objects when you use valuePaths like `level1.level2` or `['level1', 'level2', 'level3']` to access some value in the store

So always try to cache the first levels of the objects you need at module level, and use the values as a normal object. For instance:

DO:

```js
const config = require('../config')

const databaseConfig = config.get('database', { port: 3001 })

const getDatabasePort = () => databaseConfig.port
```

DON'T:

```js
const config = require('../config')

const getDatabasePort = () => config.get('database.port', 3001)
```

### 💎 Clustered apps: "forget about set() at runtime"

Since we're talking about in-memory stores, each instance of your clustered Node.JS app will have its own instance of the Config object, hence you shouldn't use `set()` anymore after the `fork()` is done, because the forked processes won't see their config objects updated.

If that's a problem for you, an in-memory store may not be what you're looking for but something like a KVS or such things.

So the implementation should be:

```js
const config = require('./config')
const { config: database } = require('./modules/database')
const { config: storage } = require('./modules/storage')
const app = require('./app')

config.setStore({ database, storage })
// Freeze the store to throw an error if somebody tries to set() something at runtime
config.freeze()

app.start() // now create you app's cluster
```

<hr>
