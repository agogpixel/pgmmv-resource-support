import { bootRootModule } from './boot-root-module.function';
import { getModule } from './get-module.function';
import { hasModule } from './has-module.function';
import { isRootModuleBooted } from './is-root-module-booted.function';
import { rootModuleName } from './root-module-name.const';
import { setModule } from './set-module.function';

declare let window: Record<string, unknown>;

describe('module', () => {
  describe('bootRootModule', () => {
    it('is a function', () => expect(typeof bootRootModule).toBe('function'));
  });

  describe('getModule', () => {
    it('is a function', () => expect(typeof getModule).toBe('function'));
  });

  describe('hasModule', () => {
    it('is a function', () => expect(typeof hasModule).toBe('function'));
  });

  describe('isRootModuleBooted', () => {
    it('is a function', () => expect(typeof isRootModuleBooted).toBe('function'));
  });

  describe('setModule', () => {
    it('is a function', () => expect(typeof setModule).toBe('function'));
  });

  it('allows get & set module operations', () => {
    const m = {};

    expect(isRootModuleBooted()).toEqual(false);

    // Won't boot without a global window object.
    const win = window;
    window = undefined as unknown as Record<string, unknown>;
    expect(setModule('test', m)).toEqual(false);
    window = win;

    // Can boot and treats root module as a global singleton.
    expect(bootRootModule()).toEqual(true);
    const ref = window[rootModuleName];
    expect(bootRootModule()).toEqual(true);
    expect(ref === window[rootModuleName]).toBe(true);

    // Get, set, & has support.
    expect(getModule('fail')).toBeUndefined();
    expect(hasModule('fail')).toEqual(false);
    expect(setModule('test', m)).toEqual(true);
    expect(getModule('test') === m).toEqual(true);
    expect(hasModule('test')).toEqual(true);
  });
});
