/**
 * Exports resource cache protected API.
 *
 * @module pgmmv-resource-support/cache/resource-cache-protected-api.interface
 */

/**
 * A simple resource cache protected API. Facilitates object inheritence.
 */
export interface ResourceCacheProtectedApi<T extends number | string | symbol = string, U = unknown> {
  /**
   * A reference to the resource cache's key/value mappings.
   *
   * @protected
   */
  cache: Record<T, U>;
}
