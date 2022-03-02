/**
 *
 */
export interface ResourceCacheProtectedApi<T extends number | string | symbol = string, U = unknown> {
  /**
   *
   */
  cache: Record<T, U>;
}
