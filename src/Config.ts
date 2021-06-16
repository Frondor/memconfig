import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'
import type { PropertyPath } from 'lodash'

type ConfigStore = Record<string, unknown>

interface ConfigSettings {
  immutable?: boolean
}

interface PrivateProps {
  immutable: boolean
  frozen: boolean
  store: ConfigStore
}

export default class Config {
  private _: PrivateProps = {
    immutable: true,
    frozen: false,
    store: {},
  }

  constructor({ immutable = true }: ConfigSettings = {}) {
    Object.defineProperty(this, '_', {
      value: { immutable, store: {}, frozen: false },
      enumerable: false,
    })
  }

  get immutable(): boolean {
    return this._.immutable
  }

  get frozen(): boolean {
    return this._.frozen
  }

  get store(): ConfigStore {
    return this.breakRef(this.valueOf())
  }

  get<T = unknown>(valuePath: PropertyPath, defaultValue?: unknown): T {
    return this.breakRef<T>(get(this.valueOf(), valuePath, defaultValue))
  }

  set(valuePath: PropertyPath, value: unknown): this {
    this.throwIfFrozen()
    set(this.valueOf(), valuePath, this.breakRef(value))
    return this
  }

  delete(valuePath: PropertyPath): this {
    this.throwIfFrozen()
    unset(this.valueOf(), valuePath)
    return this
  }

  setStore(store = {}): void {
    this.throwIfFrozen()
    this._.store = this.breakRef(store)
  }

  merge(store: Config | ConfigStore): void {
    this.setStore(Object.assign({}, this.valueOf(), store.valueOf()))
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
    this._.frozen = true
  }

  unfreeze(): void {
    this._.frozen = false
  }

  valueOf(): ConfigStore {
    return this._.store
  }

  toJSON(): ConfigStore {
    return this.valueOf()
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
