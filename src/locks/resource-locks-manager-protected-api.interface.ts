/**
 * Exports resource locks manager protected API.
 *
 * @module locks/resource-locks-manager-protected-api.interface
 */
import type { ResourceLocks } from './resource-locks.interface';

/**
 * Resource locks manager protected API. Facilitates object inheritence.
 *
 * @typeParam K Key type (default: `string`).
 */
export interface ResourceLocksManagerProtectedApi<K extends number | string | symbol = string> {
  /**
   * A reference to the resource locks manager key/value mappings.
   *
   * @protected
   */
  vault: Record<K, Required<ResourceLocks>>;
}
