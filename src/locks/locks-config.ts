/**
 *
 */
export interface ResourceLocksConfig<K extends number | string | symbol = string> {
  /**
   *
   */
  key: K;

  /**
   *
   */
  numSharedLocks?: number;

  /**
   *
   */
  exclusiveLock?: boolean;
}
