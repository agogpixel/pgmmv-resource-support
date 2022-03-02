import type { ResourceCache } from './cache';
import type { ResourceCacheProtectedApi } from './protected-api';

/**
 *
 * @param internal
 * @returns
 */
export function createResourceCache<T extends number | string | symbol = string, U = unknown>(
  internal?: ResourceCacheProtectedApi<T, U>
) {
  /**
   *
   */
  const self = {} as ResourceCache<T, U>;

  /**
   *
   */
  const internalApi = internal || ({} as ResourceCacheProtectedApi<T, U>);

  /**
   *
   */
  internalApi.cache = {} as Record<T, U>;

  /**
   *
   * @returns
   */
  self.clear = function clear() {
    const keys = Object.keys(internalApi.cache);

    for (let i = 0; i < keys.length; ++i) {
      delete internalApi.cache[keys[i] as T];
    }

    return self;
  };

  /**
   *
   * @param key
   * @returns
   */
  self.delete = function (key) {
    delete internalApi.cache[key];
    return self;
  };

  /**
   *
   * @param key
   * @returns
   */
  self.get = function get<V = U>(key: T) {
    return internalApi.cache[key] as unknown as V;
  };

  /**
   *
   * @param key
   * @returns
   */
  self.has = function has(key) {
    return !!internalApi.cache[key];
  };

  /**
   *
   * @param key
   * @param value
   * @returns
   */
  self.set = function set(key, value) {
    internalApi.cache[key] = value;
    return self;
  };

  return self;
}
