import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'
import type { PropertyPath } from 'lodash'

export default class Config {
  private _store: Record<string, unknown>

  protected frozen = false

  private _immutable = true

  constructor({ immutable = true } = {}) {
    this._immutable = immutable
    this._store = {}
  }

  get immutable() {
    return this._immutable
  }

  get store() {
    return this.breakRef(this._store)
  }

  get<T = unknown>(valuePath: PropertyPath, defaultValue?: unknown): T {
    return this.breakRef<T>(get(this._store, valuePath, defaultValue))
  }

  set(valuePath: PropertyPath, value: unknown) {
    this.throwIfFrozen()
    return set(this._store, valuePath, this.breakRef(value))
  }

  delete(valuePath: PropertyPath) {
    this.throwIfFrozen()
    return unset(this._store, valuePath)
  }

  setStore(store = {}) {
    this.throwIfFrozen()
    this._store = this.breakRef(store)
  }

  protected breakRef<T>(val: T): T {
    if (this.immutable && val) return cloneDeep(val)
    return val
  }

  private throwIfFrozen() {
    if (this.frozen) {
      const err = new Error('Cannot make changes while config is frozen')
      err.name = 'ConfigFrozenError'
      throw err
    }
  }

  freeze() {
    this.frozen = true
  }

  unfreeze() {
    this.frozen = false
  }

  toJSON() {
    return this._store
  }

  toString() {
    return JSON.stringify(this)
  }

  static from(serializedStore: string, settings = {}) {
    const config = new Config(settings)
    try {
      config.setStore(JSON.parse(serializedStore))
    } catch (error) {}
    return config
  }
}
