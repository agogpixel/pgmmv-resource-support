/**
 * Exports poll with interval function.
 *
 * @module pgmmv-resource-support/time/poll-with-interval.function
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
 * Poll for conditial satisfaction with exponential backoff.
 *
 * @param conditional Condition callback.
 * @param onProceed Proceed callback.
 * @param onTimeout Timeout callback.
 * @param initialInterval Initial interval in milliseconds.
 * @param retries Number of attempts (default is 3).
 * @public
 * @static
 */
export function pollWithBackoff(
  conditional: () => boolean,
  onProceed: () => void,
  onTimeout: (elapsed: number) => void,
  initialInterval: number,
  retries?: number
) {
  initialInterval <= 0 ? 1000 : initialInterval;
  const maxRetries = typeof retries !== 'number' || retries <= 0 ? 3 : retries;

  const startTime = +new Date();
  let elapsedTime = 0;
  let numRetries = 0;

  function poll() {
    elapsedTime += +new Date() - startTime;

    if (conditional()) {
      onProceed();
      return;
    } else if (numRetries >= maxRetries) {
      onTimeout(elapsedTime);
      return;
    }

    const time = initialInterval * 2 ** numRetries++;
    setTimeout(poll, time);
  }

  setTimeout(poll, 0);
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

// None.
