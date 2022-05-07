/**
 * Exports resource cache protected API.
 *
 * @module cache/resource-cache-protected-api.interface
 */

/**
 * A simple resource cache protected API. Facilitates object inheritence.
 *
 * @typeParam T Key type.
 * @typeParam U Value type.
 */
export interface ResourceCacheProtectedApi<T extends number | string | symbol = string, U = unknown> {
  /**
   * A reference to the resource cache's key/value mappings.
   *
   * @protected
   */
  cache: Record<T, U>;
}
