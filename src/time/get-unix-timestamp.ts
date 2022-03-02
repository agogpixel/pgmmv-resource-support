/**
 *
 * @returns
 */
export function getUnixTimestamp() {
  return Math.round(+new Date() / 1000);
}
