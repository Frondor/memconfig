const Config = require('../Config');
const Loader = require('../loaders/Loader');

class FakeLoader extends Loader {
  async load() {
    return Promise.resolve({ a: 2 });
  }
}

describe('Config class', () => {
  describe('When: instantiated without a loader and use load method', () => {
    it('Should: throw', async () => {
      const config = new Config();
      await expect(config.load()).rejects.toThrowError(
        'This config has no loader'
      );
    });
  });

  describe('When: instantiated without initial store', () => {
    it('Should: have empty store', async () => {
      const config = new Config();
      await expect(config.store.getStore()).toEqual({});
    });
  });

  describe('When: instantiated with initial store', () => {
    it('Should: have an initial store', async () => {
      const store = { a: [{ b: 3 }] };
      const config = new Config({ store });
      await expect(config.store.getStore()).toEqual(store);
    });
  });

  describe('When: get defined value from path', () => {
    it('Should: return defined value', async () => {
      const store = { a: [{ b: 3 }] };
      const config = new Config({ store });
      await expect(config.get('a[0].b')).toBe(3);
    });
  });

  describe('When: get undefined value from path', () => {
    it('Should: return undefined', async () => {
      const store = { a: [{ b: 3 }] };
      const config = new Config({ store });
      await expect(config.get(['a', 'b'])).toBeUndefined();
    });
  });

  describe('When: get undefined value and provide default', () => {
    it('Should: return default', async () => {
      const store = { a: [{ b: 3 }] };
      const config = new Config({ store });
      await expect(config.get('c', 6)).toBe(6);
    });
  });

  describe('When: set value into specific path', () => {
    it('Should: see that value in the store', async () => {
      const store = { a: [{ b: 1 }] };
      const config = new Config({ store });
      await expect(config.set('a[1].b', 2).store.getStore()).toEqual({
        a: [{ b: 1 }, { b: 2 }]
      });
    });
  });

  describe('Using makeSingleton method', () => {
    afterEach(() => {
      const config = require('../');
      if (config.restoreModule) config.restoreModule();
    });

    describe('When: used with sync loader', () => {
      it('Should: override module.exports with the singleton', () => {
        require('../').makeSingleton({ store: { a: 1 } });
        const config = require('../');
        expect(config.get('a')).toBe(1);
      });
    });

    describe('When: used with async loader', () => {
      it('Should: override module.exports with the singleton', async () => {
        await require('../')
          .makeSingleton({ loader: new FakeLoader() })
          .load();
        const config = require('../');
        expect(config.get('a')).toBe(2);
      });
    });
  });
});
