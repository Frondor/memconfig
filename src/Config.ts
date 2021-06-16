import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'
import type { PropertyPath } from 'lodash'

type ConfigStore = Record<string, unknown>

interface ConfigSettings {
  immutable?: boolean
}
export default class Config {
  private _store: ConfigStore

  protected frozen = false

  private _immutable = true

  constructor({ immutable = true }: ConfigSettings = {}) {
    this._immutable = immutable
    this._store = {}
  }

  get immutable(): boolean {
    return this._immutable
  }

  get store(): ConfigStore {
    return this.breakRef(this._store)
  }

  get<T = unknown>(valuePath: PropertyPath, defaultValue?: unknown): T {
    return this.breakRef<T>(get(this._store, valuePath, defaultValue))
  }

  set(valuePath: PropertyPath, value: unknown): this {
    this.throwIfFrozen()
    set(this._store, valuePath, this.breakRef(value))
    return this
  }

  delete(valuePath: PropertyPath): this {
    this.throwIfFrozen()
    unset(this._store, valuePath)
    return this
  }

  setStore(store = {}): void {
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

  freeze(): void {
    this.frozen = true
  }

  unfreeze(): void {
    this.frozen = false
  }

  toJSON(): ConfigStore {
    return this._store
  }

  toString(): string {
    return JSON.stringify(this)
  }

  static from(serializedStore: string, settings = {}): Config {
    const config = new Config(settings)
    try {
      config.setStore(JSON.parse(serializedStore))
    } catch (error) {} // eslint-disable-line
    return config
  }
}
