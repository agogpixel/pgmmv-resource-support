import { getUnixTimestamp } from './get-unix-timestamp';

/**
 *
 * @param conditional
 * @param onProceed
 * @param onTimeout
 * @param interval
 * @param timeout
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

  const startTime = getUnixTimestamp();
  let elapsedTime = 0;

  function poll() {
    elapsedTime += getUnixTimestamp() - startTime;

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
