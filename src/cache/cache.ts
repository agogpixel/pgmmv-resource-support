/**
 *
 */
export interface ResourceCache<T extends number | string | symbol = string, U = unknown> {
  /**
   *
   */
  clear(): this;

  /**
   *
   * @param key
   */
  delete(key: T): this;

  /**
   *
   * @param key
   */
  get<V = U>(key: T): V | undefined;

  /**
   *
   * @param key
   */
  has(key: T): boolean;

  /**
   *
   * @param key
   * @param value
   */
  set(key: T, value: U): this;
}
