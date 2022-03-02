import { getUnixTimestamp } from './get-unix-timestamp';

/**
 *
 * @param conditional
 * @param onProceed
 * @param onTimeout
 * @param initialInterval
 * @param retries
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

  const startTime = getUnixTimestamp();
  let elapsedTime = 0;
  let numRetries = 0;

  function poll() {
    elapsedTime += getUnixTimestamp() - startTime;

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
