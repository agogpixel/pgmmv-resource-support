/**
 * Exports resource cache public API.
 *
 * @module pgmmv-resource-support/cache/resource-cache.interface
 */

/**
 * A simple resource cache API. Supports basic CRUD operations.
 */
export interface ResourceCache<T extends number | string | symbol = string, U = unknown> {
  /**
   * Clear cache of all currently stored resources.
   *
   * @returns A reference to this resource cache instance (to facilitate method
   * chaining).
   * @public
   */
  clear(): this;

  /**
   * Delete the resource, referenced by specified key, from the cache.
   *
   * @param key Key that maps to some resource within the cache.
   * @returns A reference to this resource cache instance (to facilitate method
   * chaining).
   * @public
   */
  delete(key: T): this;

  /**
   * Get a resource, referenced by specified key, from the cache.
   *
   * @param key Key that maps to some resource within the cache.
   * @returns A resource referenced by specified key, or `undefined` if not
   * found.
   * @public
   */
  get<V = U>(key: T): V | undefined;

  /**
   * Test if cache contains resource referenced by specified key.
   *
   * @param key Key that maps to some resource within the cache.
   * @returns True if resource found, false otherwise.
   * @public
   */
  has(key: T): boolean;

  /**
   * Set a resource, reference by specified key, in the cache.
   * @param key The key that will reference the specified resource.
   * @param value The resource that will be referenced by the specified key.
   * @returns A reference to this resource cache instance (to facilitate method
   * chaining).
   * @public
   */
  set(key: T, value: U): this;
}
