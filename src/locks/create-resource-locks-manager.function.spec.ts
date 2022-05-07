import { createResourceLocksManager } from './create-resource-locks-manager.function';
import type { ReleaseLock } from './release-lock.type';
import type { ResourceLocksManagerProtectedApi } from './resource-locks-manager-protected-api.interface';
import type { ResourceLocksManager } from './resource-locks-manager.interface';

describe('createResourceLocksManager', () => {
  it('is a function', () => expect(typeof createResourceLocksManager).toBe('function'));

  it('returns an object instance', () => expect(createResourceLocksManager()).toBeTruthy());

  describe('object instance', () => {
    const internal = {} as ResourceLocksManagerProtectedApi;
    let manager: ResourceLocksManager;

    describe('protected API', () => {
      beforeEach(() => (manager = createResourceLocksManager(internal)));

      it('implements property: vault', () => {
        expect(internal.vault).toBeTruthy();
        expect(typeof internal.vault).toEqual('object');
      });
    });

    describe('public API', () => {
      beforeEach(() => (manager = createResourceLocksManager(internal)));

      it('creates locks', () => {
        expect(Object.keys(internal.vault).length).toEqual(0);
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        expect(Object.keys(internal.vault).length).toEqual(1);
      });

      it('prevents locks with duplicate keys from being created', () => {
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        expect(manager.createLocks({ key: 'locksA' })).toBe(false);
        expect(Object.keys(internal.vault).length).toEqual(1);
      });

      it('tests for the existence of locks', () => {
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        expect(manager.hasLocks('locksA')).toBe(true);
        expect(manager.hasLocks('fail')).toBe(false);
      });

      it('can create locks with default config values', () => {
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        expect(internal.vault['locksA'].maxExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].currentExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].maxSharedLocksCount).toEqual(2);
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(0);
      });

      it('can create locks with config that contains invalid shared lock count value', () => {
        expect(manager.createLocks({ key: 'locksA', numSharedLocks: -100 })).toBe(true);
        expect(internal.vault['locksA'].maxExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].currentExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].maxSharedLocksCount).toEqual(2);
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(0);
      });

      it('can create locks with config that contains exlusive lock flag value', () => {
        expect(manager.createLocks({ key: 'locksA', exclusiveLock: true })).toBe(true);
        expect(internal.vault['locksA'].maxExclusiveLockCount).toEqual(1);
        expect(internal.vault['locksA'].currentExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].maxSharedLocksCount).toEqual(2);
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(0);
      });

      it('can create locks with config that contains valid shared lock count value', () => {
        expect(manager.createLocks({ key: 'locksA', numSharedLocks: 100 })).toBe(true);
        expect(internal.vault['locksA'].maxExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].currentExclusiveLockCount).toEqual(0);
        expect(internal.vault['locksA'].maxSharedLocksCount).toEqual(100);
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(0);
      });

      it('can destroy locks', () => {
        expect(Object.keys(internal.vault).length).toEqual(0);
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        expect(Object.keys(internal.vault).length).toEqual(1);
        expect(manager.createLocks({ key: 'locksB' })).toBe(true);
        expect(Object.keys(internal.vault).length).toEqual(2);
        manager.destroyLocks('locksA');
        expect(Object.keys(internal.vault).length).toEqual(1);
        manager.destroyLocks('locksB');
        expect(Object.keys(internal.vault).length).toEqual(0);
      });

      it('will not acquire a shared lock that does not exist', () =>
        expect(manager.acquireSharedLock('fail')).toBeUndefined());

      it('can acquire a shared lock and return a release callback', () => {
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        const releaseLock = manager.acquireSharedLock('locksA') as ReleaseLock;
        expect(typeof releaseLock).toEqual('function');
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(1);
        releaseLock();
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(0);
      });

      it('will not acquire a shared lock when none are available', () => {
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        const releaseLockA = manager.acquireSharedLock('locksA') as ReleaseLock;
        expect(typeof releaseLockA).toEqual('function');
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(1);
        const releaseLockB = manager.acquireSharedLock('locksA') as ReleaseLock;
        expect(typeof releaseLockB).toEqual('function');
        expect(internal.vault['locksA'].currentSharedLocksCount).toEqual(2);
        expect(manager.acquireSharedLock('locksA')).toBeUndefined();
      });

      it('will not acquire an exclusive lock that does not exist', () => {
        expect(manager.acquireExclusiveLock('fail')).toBeUndefined();
        expect(manager.createLocks({ key: 'locksA' })).toBe(true);
        expect(manager.acquireExclusiveLock('locksA')).toBeUndefined();
      });

      it('can acquire an exlusive lock and return a release callback', () => {
        expect(manager.createLocks({ key: 'locksA', exclusiveLock: true })).toBe(true);
        const releaseLock = manager.acquireExclusiveLock('locksA') as ReleaseLock;
        expect(typeof releaseLock).toEqual('function');
        expect(internal.vault['locksA'].currentExclusiveLockCount).toEqual(1);
        releaseLock();
        expect(internal.vault['locksA'].currentExclusiveLockCount).toEqual(0);
      });

      it('will not acquire a shared lock when an exclusive lock is active', () => {
        expect(manager.createLocks({ key: 'locksA', exclusiveLock: true })).toBe(true);
        manager.acquireExclusiveLock('locksA');
        expect(manager.acquireSharedLock('locksA')).toBeUndefined();
      });

      it('will not acquire an exclusive lock when a shared lock is active', () => {
        expect(manager.createLocks({ key: 'locksA', exclusiveLock: true })).toBe(true);
        manager.acquireSharedLock('locksA');
        expect(manager.acquireExclusiveLock('locksA')).toBeUndefined();
      });
    });
  });
});
