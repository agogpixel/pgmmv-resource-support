import { getUnixTimestamp } from './get-unix-timestamp.function';

describe('getUnixTimestamp', () => {
  it('is a function', () => expect(typeof getUnixTimestamp).toBe('function'));

  it('provides a timestamp (seconds since unix epoch)', () =>
    expect(getUnixTimestamp()).toBeLessThanOrEqual(Math.round(+new Date() / 1000)));
});
