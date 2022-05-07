/**
 * Exports poll with interval function.
 *
 * @module time/poll-with-interval.function
 */

////////////////////////////////////////////////////////////////////////////////
// Public Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Public Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Poll until conditional satisfaction with specified interval & optional
 * timeout. Will call `onProceed` when condition is satisfied, `onTimeout` if
 * provided timout is reached.
 *
 * @param conditional Condition callback.
 * @param onProceed Proceed callback.
 * @param onTimeout Timeout callback.
 * @param interval Interval in milliseconds.
 * @param timeout Timeout in milliseconds.
 */
export function pollWithInterval(
  conditional: () => boolean,
  onProceed: () => void,
  onTimeout: (elapsed: number) => void,
  interval: number,
  timeout?: number
) {
  interval = interval <= 0 ? 1000 : interval;
  timeout = typeof timeout !== 'number' || timeout < 0 ? 0 : timeout;

  const startTime = +new Date();
  let elapsedTime = 0;

  function poll() {
    elapsedTime += +new Date() - startTime;

    if (conditional()) {
      onProceed();
      return;
    } else if (timeout && elapsedTime >= timeout) {
      onTimeout(elapsedTime);
      return;
    }

    setTimeout(poll, interval);
  }

  setTimeout(poll, 0);
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

// None.
