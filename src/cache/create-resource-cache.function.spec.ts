import { createResourceCache } from './create-resource-cache.function';
import { ResourceCacheProtectedApi } from './resource-cache-protected-api.interface';
import type { ResourceCache } from './resource-cache.interface';

describe('createResourceCache', () => {
  it('is a function', () => expect(typeof createResourceCache).toBe('function'));

  it('returns an object instance', () => expect(createResourceCache()).toBeTruthy());

  describe('object instance', () => {
    const internal = {} as ResourceCacheProtectedApi;
    let cache: ResourceCache;

    beforeAll(() => (cache = createResourceCache(internal)));

    it('references a protected API implementation', () => expect(internal.cache).toBeTruthy());

    it('implements the public API', () => {
      const resourceA = {};
      const resourceB = { test: true };
      const resourceC = { test: 'yes' };

      // Create & read tests.

      expect(cache.set('keyA', resourceA)).toEqual(cache);
      expect(cache.has('keyA')).toBe(true);
      expect(cache.get('keyA')).toEqual(resourceA);

      expect(cache.set('keyB', resourceB)).toEqual(cache);
      expect(cache.has('keyB')).toBe(true);
      expect(cache.get('keyB')).toEqual(resourceB);

      expect(cache.set('keyC', resourceC)).toEqual(cache);
      expect(cache.has('keyC')).toBe(true);
      expect(cache.get('keyC')).toEqual(resourceC);

      // Update tests.

      expect(cache.set('keyA', resourceC)).toEqual(cache);
      expect(cache.get('keyA')).toEqual(resourceC);

      expect(cache.set('keyB', resourceA)).toEqual(cache);
      expect(cache.get('keyB')).toEqual(resourceA);

      expect(cache.set('keyC', resourceB)).toEqual(cache);
      expect(cache.get('keyC')).toEqual(resourceB);

      // Delete tests.

      expect(cache.delete('keyB')).toEqual(cache);
      expect(cache.has('keyB')).toBe(false);

      expect(cache.clear()).toEqual(cache);
      expect(Object.keys(internal.cache).length).toEqual(0);
    });
  });
});
