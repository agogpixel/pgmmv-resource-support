/**
 * Exports resource locks manager public API.
 *
 * @module locks/resource-locks-manager.interface
 */

import type { ReleaseLock } from './release-lock.type';
import type { ResourceLocksConfig } from './resource-locks-config.interface';

/**
 * A simple resource locks manager API. Supports basic CRD operations on lock
 * state & the ability to acquire these locks.
 *
 * @typeParam K Key type (default: `string`).
 */
export interface ResourceLocksManager<K extends number | string | symbol = string> {
  /**
   * Try to acquire an exclusive lock associated with specified key.
   *
   * @param key Key that maps to some locks within the manager.
   * @returns When successful, a callback to release the lock. Undefined
   * otherwise.
   * @public
   */
  acquireExclusiveLock(key: K): ReleaseLock | undefined;

  /**
   * Try to acquire a shared lock associated with specified key.
   *
   * @param key Key that maps to some locks within the manager.
   * @returns When successful, a callback to release the lock. Undefined
   * otherwise.
   * @public
   */
  acquireSharedLock(key: K): ReleaseLock | undefined;

  /**
   * Create new locks within the manager.
   *
   * @param config Locks configuration.
   * @returns True when successful, false otherwise.
   * @public
   */
  createLocks(config: ResourceLocksConfig<K>): boolean;

  /**
   * Destroy locks state associated with specified key.
   *
   * @param key Key that maps to some locks within the manager.
   * @public
   */
  destroyLocks(key: K): void;

  /**
   * Test if the manager contains locks associated with specified key.
   *
   * @param key Key that maps to some locks within the manager.
   * @returns True when association exists, false otherwise.
   * @public
   */
  hasLocks(key: K): boolean;
}
