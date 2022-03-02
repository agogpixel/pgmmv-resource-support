/**
 *
 */
export interface ResourceLocks {
  /**
   *
   */
  currentSharedLocksCount: number;

  /**
   *
   */
  maxSharedLocksCount: number;

  /**
   *
   */
  currentExclusiveLockCount: number;

  /**
   *
   */
  maxExclusiveLockCount: number;
}
