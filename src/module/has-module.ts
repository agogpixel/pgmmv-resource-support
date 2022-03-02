import { isBooted } from './is-booted';
import { rootModuleName } from './root-module-name';

/**
 *
 * @param key
 * @returns
 */
export function hasModule(key: string) {
  return isBooted() && !!(window[rootModuleName] as Record<string, unknown>)[key];
}
