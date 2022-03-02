import { rootModuleName } from './root-module-name';

/**
 *
 * @returns
 */
export function isBooted() {
  return !!(window && window[rootModuleName]);
}
