/* eslint-disable @typescript-eslint/naming-convention,no-underscore-dangle */
import cloneDeep from 'lodash/cloneDeep'
import Config from '../src/Config'

const store = (defaults = {}): Record<string, unknown> =>
  cloneDeep({
    string: 'string',
    obj: {
      a: 1,
    },
    arr: [1, '2', 3],
    ...defaults,
  })

const makeConfig = ({ _store = {}, immutable = true } = {}) => {
  const config = new Config({ immutable })
  config.setStore({ ...store(), ..._store })
  return config
}

describe('config class', () => {
  it('immutable by default', () => {
    const config = new Config()
    expect(config.immutable).toBe(true)
  })

  it('store immutability', () => {
    const config = new Config()
    const _store = store({ mutation: 1 })
    config.setStore(_store)
    _store.mutation = 2
    expect(config.get('mutation')).toBe(1)
  })

  it('setStore stores deeply cloned object', () => {
    const config = new Config()
    const _store = store()
    config.setStore(_store)
    expect(config.store).not.toBe(_store)
  })

  it('config.get accepts PropertyPath paths', () => {
    const config = makeConfig()
    expect(config.get('arr[1]')).toBe('2')
    expect(config.get(['arr', 1])).toBe('2')
    expect(config.get('arr.1')).toBe('2')
    expect(config.get(['obj', 'a'])).toBe(1)
    expect(config.get('obj.a')).toBe(1)
  })

  it('config.get returns default arg for undefined properties', () => {
    const config = new Config()
    config.set('nullish', null)
    expect(config.get('nullish', 1)).toBeNull()
    expect(config.get('undefinedProp', 'defaultValue')).toBe('defaultValue')
  })

  it('config.set sets given value to PropertyPath', () => {
    const config = new Config()
    config.set('a', 1)
    config.set('b.c', 2)
    config.set(['d', 'e'], 3)
    expect(config.get('a')).toBe(1)
    expect(config.get('b')).toStrictEqual({ c: 2 })
    expect(config.get('d')).toStrictEqual({ e: 3 })
  })

  it('config.delete removes value at given PropertyPath', () => {
    const config = new Config()
    config.set('a.b', { c: 1, d: 2 })
    config.delete(['a', 'b', 'c'])
    expect(config.store).toStrictEqual({ a: { b: { d: 2 } } })
  })

  it('config set/delete/setStore methods throw in frozen mode', () => {
    const config = new Config()
    const message = 'Cannot make changes while config is frozen'
    config.freeze()
    expect(() => config.set('a', 1)).toThrow(message)
    expect(() => config.delete('a')).toThrow(message)
    expect(() => config.setStore()).toThrow(message)
    config.unfreeze()
    expect(() => config.set('a', 1)).not.toThrow()
    expect(() => config.delete('a')).not.toThrow()
    expect(() => config.setStore()).not.toThrow()
  })

  it('config de/serializes', () => {
    const config = makeConfig()
    const serialized = '{"string":"string","obj":{"a":1},"arr":[1,"2",3]}'
    expect(JSON.stringify(config)).toBe(serialized)
    expect(config.toString()).toBe(serialized)
    expect(Config.from(serialized)).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          1,
          "2",
          3,
        ],
        "obj": Object {
          "a": 1,
        },
        "string": "string",
      }
    `)
  })

  it('config.from static method accepts settings', () => {
    const serialized = '{"string":"string","obj":{"a":1},"arr":[1,"2",3]}'
    const config = Config.from(serialized, { immutable: false })
    expect(config.immutable).toBe(false)
    expect(config).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          1,
          "2",
          3,
        ],
        "obj": Object {
          "a": 1,
        },
        "string": "string",
      }
    `)
  })
})
