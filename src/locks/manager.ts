import type { ReleaseLock } from './release-lock';
import type { ResourceLocksConfig } from './locks-config';

/**
 *
 */
export interface ResourceLocksManager<K extends number | string | symbol = string> {
  /**
   *
   * @param key
   */
  acquireExclusiveLock(key: K): ReleaseLock | undefined;

  /**
   *
   * @param key
   */
  acquireSharedLock(key: K): ReleaseLock | undefined;

  /**
   *
   * @param config
   */
  createLocks(config: ResourceLocksConfig<K>): boolean;

  /**
   *
   * @param key
   */
  destroyLocks(key: K): void;

  /**
   *
   * @param key
   */
  hasLocks(key: K): boolean;
}
