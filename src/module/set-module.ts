import { boot } from './boot';
import { isBooted } from './is-booted';
import { rootModuleName } from './root-module-name';

/**
 *
 * @param key
 * @param module
 * @returns
 */
export function setModule<T extends object>(key: string, module: T) {
  if (!isBooted()) {
    if (!boot()) {
      return false;
    }
  }

  (window[rootModuleName] as Record<string, T>)[key] = module;

  return true;
}
