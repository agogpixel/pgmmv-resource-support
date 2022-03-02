import { rootModuleName } from './root-module-name';
import { isBooted } from './is-booted';

/**
 *
 * @returns
 */
export function boot() {
  if (isBooted()) {
    return true;
  }

  if (!window) {
    return false;
  }

  window[rootModuleName] = {};

  return true;
}
