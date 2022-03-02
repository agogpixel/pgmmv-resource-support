import { hasModule } from './has-module';
import { rootModuleName } from './root-module-name';

/**
 *
 * @param key
 * @returns
 */
export function getModule<T extends object = object>(key: string) {
  if (!hasModule(key)) {
    return;
  }

  return (window[rootModuleName] as Record<string, T>)[key];
}
