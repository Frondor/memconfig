const path = require('path');
const BaseLoader = require('../loaders/Loader');
const FileSystemLoader = require('../loaders/FileSystemLoader');

const MOCK_PATHS = path.join(__dirname, '__mocks__');

describe('Loaders', () => {
  describe('When: abstract loader is instantiated directly', () => {
    it('Should: throw', () => {
      expect(() => new BaseLoader()).toThrow();
    });
  });

  describe('When: abstract load method is not implemented', () => {
    it('Should: throw', () => {
      const fakeLoader = new (class FakeLoader extends BaseLoader {})();
      expect(() => fakeLoader.load()).toThrow();
    });
  });

  describe('FileSystemLoader', () => {
    describe('When: used with defaults', () => {
      it('Should: use current working dir', () => {
        const loader = new FileSystemLoader();
        expect(loader.directories).toEqual([process.cwd()]);
      });
    });

    describe('When: used with specific directories', () => {
      it('Should: get specified directories', () => {
        const directories = ['A', MOCK_PATHS];
        const loader = new FileSystemLoader({ directories });
        expect(loader.directories).toEqual(directories);
      });
    });

    describe('When: call load method', () => {
      it('Should: load files in the specified directories', () => {
        const directories = [MOCK_PATHS];
        const loader = new FileSystemLoader({ directories });
        expect(loader.load()).toEqual({
          a: {
            b: 'c'
          },
          d: {
            e: 'f'
          },
          g: {
            h: {
              i: {
                j: ['k']
              }
            }
          }
        });
      });
    });
  });
});
