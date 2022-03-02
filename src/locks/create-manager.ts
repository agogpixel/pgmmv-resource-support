import type { ResourceLocks } from './locks';
import type { ResourceLocksManager } from './manager';
import type { ResourceLocksManagerProtectedApi } from './manager-protected-api';

/**
 *
 * @param internal
 * @returns
 */
export function createResourceLocksManager<K extends number | string | symbol = string>(
  internal?: ResourceLocksManagerProtectedApi<K>
) {
  /**
   *
   */
  const self = {} as ResourceLocksManager<K>;

  /**
   *
   */
  const internalApi = internal || ({} as ResourceLocksManagerProtectedApi<K>);

  /**
   *
   */
  internalApi.vault = {} as Record<K, Required<ResourceLocks>>;

  /**
   *
   * @param key
   * @returns
   */
  self.acquireExclusiveLock = function acquireExclusiveLock(key) {
    if (!self.hasLocks(key)) {
      return;
    }

    const locks = internalApi.vault[key];

    if (locks.currentSharedLocksCount > 0 || locks.currentExclusiveLockCount >= locks.maxExclusiveLockCount) {
      return;
    }

    ++locks.currentExclusiveLockCount;

    return function releaseExclusiveLock() {
      --locks.currentExclusiveLockCount;
    };
  };

  /**
   *
   * @param key
   * @returns
   */
  self.acquireSharedLock = function acquireSharedLock(key) {
    if (!self.hasLocks(key)) {
      return;
    }

    const locks = internalApi.vault[key];

    if (
      locks.currentExclusiveLockCount >= locks.maxExclusiveLockCount ||
      locks.currentSharedLocksCount >= locks.maxSharedLocksCount
    ) {
      return;
    }

    ++locks.currentSharedLocksCount;

    return function releaseSharedLock() {
      --locks.currentSharedLocksCount;
    };
  };

  /**
   *
   * @param config
   * @returns
   */
  self.createLocks = function createLocks(config) {
    if (self.hasLocks(config.key)) {
      return false;
    }

    const locks: ResourceLocks = {
      currentSharedLocksCount: 0,
      maxSharedLocksCount:
        typeof config.numSharedLocks !== 'number' || (config.numSharedLocks && config.numSharedLocks < 2)
          ? 2
          : config.numSharedLocks,
      currentExclusiveLockCount: 0,
      maxExclusiveLockCount: config.exclusiveLock ? 1 : 0
    };

    internalApi.vault[config.key] = locks;

    return true;
  };

  /**
   *
   * @param key
   */
  self.destroyLocks = function destroyLocks(key) {
    delete internalApi.vault[key];
  };

  /**
   *
   * @param key
   * @returns
   */
  self.hasLocks = function hasLocks(key) {
    return !!internalApi.vault[key];
  };

  return self;
}
