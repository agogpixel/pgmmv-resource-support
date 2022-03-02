import { createResourceCache, createResourceLocksManager } from '@agogpixel/pgmmv-resource-support';

describe('createResourceCache', () => {
  it('is a function', () => expect(typeof createResourceCache).toBe('function'));
});

describe('createResourceLocksManager', () => {
  it('is a function', () => expect(typeof createResourceLocksManager).toBe('function'));
});
