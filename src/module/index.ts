/**
 * Exports helper methods for managing 'global' namespaces.
 *
 * Please ensure that `ROOT_MODULE_NAME` string value is injected at build time,
 * or otherwise exists in the global execution context. This will be a key on
 * the global window object that maps to an object (which contains our modules).
 * Default value is `myModules`.
 *
 * @module module
 */
export { getModule } from './get-module.function';
export { hasModule } from './has-module.function';
export { setModule } from './set-module.function';
