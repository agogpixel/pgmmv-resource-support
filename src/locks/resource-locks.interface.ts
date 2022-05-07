/**
 * Exports resource locks API.
 *
 * @module locks/resource-locks.interface
 */

/**
 * Resource locks state.
 */
export interface ResourceLocks {
  /**
   * Track the current number of shared locks in use.
   *
   * @public
   */
  currentSharedLocksCount: number;

  /**
   * The maximum number of shared locks available.
   *
   * @public
   */
  maxSharedLocksCount: number;

  /**
   * Track the current number of exclusive locks in use.
   *
   * @public
   */
  currentExclusiveLockCount: number;

  /**
   * The maximum number of exclusive locks available.
   *
   * @public
   */
  maxExclusiveLockCount: number;
}
