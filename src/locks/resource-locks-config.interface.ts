/**
 * Exports resource locks configuration API.
 *
 * @module locks/resource-locks-config.interface
 */

/**
 * Resource locks configuration.
 *
 * @typeParam K Key type (default: `string`).
 */
export interface ResourceLocksConfig<K extends number | string | symbol = string> {
  /**
   * Unique key used to fetch the associated locks state.
   *
   * @public
   */
  key: K;

  /**
   * Number of shared locks to track. This value will always be 2 or greater.
   *
   * @public
   */
  numSharedLocks?: number;

  /**
   * Flag that an exclusive lock is available for use.
   *
   * @public
   */
  exclusiveLock?: boolean;
}
