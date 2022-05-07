import { pollWithBackoff } from './poll-with-backoff.function';

describe('pollWithBackoff', () => {
  it('is a function', () => expect(typeof pollWithBackoff).toBe('function'));

  it('will poll until conditional is satisfied (default 3 tries, before expire)', (done) => {
    let count = 0;

    pollWithBackoff(
      () => ++count === 3,
      () => {
        expect(count).toEqual(3);
        done();
      },
      () => expect(true).toEqual(false),
      150
    );
  });

  it('will poll until conditional is satisfied (default 3 tries, invalid initial interval, before expire)', (done) => {
    let count = 0;

    pollWithBackoff(
      () => ++count === 3,
      () => {
        expect(count).toEqual(3);
        done();
      },
      () => expect(true).toEqual(false),
      -1000
    );
  });

  it('will poll until conditional is satisfied (invalid tries, invalid initial interval, before expire)', (done) => {
    let count = 0;

    pollWithBackoff(
      () => ++count === 3,
      () => {
        expect(count).toEqual(3);
        done();
      },
      () => expect(true).toEqual(false),
      150,
      -100
    );
  });

  it('will poll until conditional is satisfied (custom tries, custom initial interval, before expire)', (done) => {
    let count = 0;

    pollWithBackoff(
      () => ++count === 5,
      () => {
        expect(count).toEqual(5);
        done();
      },
      () => expect(true).toEqual(false),
      200,
      5
    );
  });

  it('will poll until backoff limit is reached', (done) => {
    let count = 0;

    pollWithBackoff(
      () => {
        ++count;
        return false;
      },
      () => expect(true).toEqual(false),
      (elapsedTime) => {
        expect(count).toEqual(3);
        expect(elapsedTime).toBeGreaterThan(0);
        done();
      },
      200,
      2
    );
  });
});
