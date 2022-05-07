/**
 * Exports resource cache factory function.
 *
 * @module pgmmv-resource-support/cache/create-resource-cache.function
 */
import type { ResourceCache } from './resource-cache.interface';
import type { ResourceCacheProtectedApi } from './resource-cache-protected-api.interface';

////////////////////////////////////////////////////////////////////////////////
// Public Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Public Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Create an object instance that implements the {@link ResourceCache}
 * interface. This is an in-memory cache with no TTL support.
 *
 * @param internal Provide an object to 'inherit' a reference to the resource
 * cache's internal {@link ResourceCacheProtectedApi} implementation.
 * @returns An object instance that implements the {@link ResourceCache}
 * interface.
 * @public
 * @static
 */
export function createResourceCache<T extends number | string | symbol = string, U = unknown>(
  internal?: ResourceCacheProtectedApi<T, U>
) {
  // Public API container.
  const self = {} as ResourceCache<T, U>;

  // Protected API container.
  const internalApi = internal || ({} as ResourceCacheProtectedApi<T, U>);

  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Protected Properties
  //////////////////////////////////////////////////////////////////////////////

  internalApi.cache = {} as Record<T, U>;

  //////////////////////////////////////////////////////////////////////////////
  // Protected Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Methods
  //////////////////////////////////////////////////////////////////////////////

  self.clear = function () {
    const keys = Object.keys(internalApi.cache);

    for (let i = 0; i < keys.length; ++i) {
      delete internalApi.cache[keys[i] as T];
    }

    return self;
  };

  self.delete = function (key) {
    delete internalApi.cache[key];
    return self;
  };

  self.get = function <V = U>(key: T) {
    return internalApi.cache[key] as unknown as V;
  };

  self.has = function (key) {
    return !!internalApi.cache[key];
  };

  self.set = function (key, value) {
    internalApi.cache[key] = value;
    return self;
  };

  return self;
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

// None.
