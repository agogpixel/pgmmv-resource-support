/**
 * Exports resource locks manager factory function.
 *
 * @module locks/create-resource-locks-manager.function
 */
import type { ResourceLocksManagerProtectedApi } from './resource-locks-manager-protected-api.interface';
import type { ResourceLocksManager } from './resource-locks-manager.interface';
import type { ResourceLocks } from './resource-locks.interface';

////////////////////////////////////////////////////////////////////////////////
// Public Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Public Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Create an object instance that implements the {@link ResourceLocksManager}
 * interface. This implementation tracks individual lock states in-memory.
 *
 * @typeParam K Key type (default: `string`).
 * @param internal Provide an object to 'inherit' a reference to the resource
 * locks manager's internal {@link ResourceLocksManagerProtectedApi}
 * implementation.
 * @returns An object instance that implements the {@link ResourceLocksManager}
 * interface.
 * @public
 * @static
 */
export function createResourceLocksManager<K extends number | string | symbol = string>(
  internal?: ResourceLocksManagerProtectedApi<K>
) {
  // Public API container.
  const self = {} as ResourceLocksManager<K>;

  // Protected API container.
  const internalApi = internal || ({} as ResourceLocksManagerProtectedApi<K>);

  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Protected Properties
  //////////////////////////////////////////////////////////////////////////////

  internalApi.vault = {} as Record<K, Required<ResourceLocks>>;

  //////////////////////////////////////////////////////////////////////////////
  // Protected Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Methods
  //////////////////////////////////////////////////////////////////////////////

  self.acquireExclusiveLock = function (key) {
    if (!self.hasLocks(key)) {
      return;
    }

    const locks = internalApi.vault[key];

    if (locks.currentSharedLocksCount > 0 || locks.currentExclusiveLockCount >= locks.maxExclusiveLockCount) {
      return;
    }

    ++locks.currentExclusiveLockCount;

    return function () {
      --locks.currentExclusiveLockCount;
    };
  };

  self.acquireSharedLock = function (key) {
    if (!self.hasLocks(key)) {
      return;
    }

    const locks = internalApi.vault[key];

    if (
      (locks.maxExclusiveLockCount && locks.currentExclusiveLockCount >= locks.maxExclusiveLockCount) ||
      locks.currentSharedLocksCount >= locks.maxSharedLocksCount
    ) {
      return;
    }

    ++locks.currentSharedLocksCount;

    return function () {
      --locks.currentSharedLocksCount;
    };
  };

  self.createLocks = function (config) {
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

  self.destroyLocks = function (key) {
    delete internalApi.vault[key];
  };

  self.hasLocks = function (key) {
    return !!internalApi.vault[key];
  };

  return self;
}
