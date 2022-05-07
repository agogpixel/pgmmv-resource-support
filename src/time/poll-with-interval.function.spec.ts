import { pollWithInterval } from './poll-with-interval.function';

describe('pollWithInterval', () => {
  it('is a function', () => expect(typeof pollWithInterval).toBe('function'));

  it('will poll until conditional is satisfied (no timeout)', (done) => {
    let count = 0;

    pollWithInterval(
      () => ++count === 3,
      () => {
        expect(count).toEqual(3);
        done();
      },
      () => expect(true).toEqual(false),
      150
    );
  });

  it('will poll until conditional is satisfied (default interval 1000 ms)', (done) => {
    let count = 0;

    pollWithInterval(
      () => ++count === 3,
      () => {
        expect(count).toEqual(3);
        done();
      },
      () => expect(true).toEqual(false),
      -1000
    );
  });

  it('will poll until timeout', (done) => {
    pollWithInterval(
      () => false,
      () => expect(true).toEqual(false),
      (elapsedTime) => {
        expect(elapsedTime).toBeGreaterThanOrEqual(1000);
        done();
      },
      100,
      1000
    );
  });
});
