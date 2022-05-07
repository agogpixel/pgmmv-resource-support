/**
 * Exports JSON logic condition type.
 *
 * @module pgmmv-resource-support/json/logic/json-logic-condition.type
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

/**
 * JSON logic condition type.
 */
export type JsonLogicCondition<K extends number | string, P extends JsonValue> = [K, P];
