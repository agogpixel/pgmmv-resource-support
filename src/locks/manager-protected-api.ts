import type { ResourceLocks } from './locks';

/**
 *
 */
export interface ResourceLocksManagerProtectedApi<K extends number | string | symbol = string> {
  /**
   *
   */
  vault: Record<K, Required<ResourceLocks>>;
}
