/**
 * Exports JSON logic condition type.
 *
 * @module json/logic/json-logic-condition.type
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

/**
 * JSON logic condition type.
 *
 * @typeParam K Condition key type.
 * @typeParam P Condition paramater/value type.
 */
export type JsonLogicCondition<K extends number | string, P extends JsonValue> = [K, P];
