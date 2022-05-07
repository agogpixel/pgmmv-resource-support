/**
 * Exports JSON logic constraint factory type.
 *
 * @module json/logic/json-logic-constraint-factory.type
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { JsonLogicCondition } from './json-logic-condition.type';
import type { JsonLogicConstraint } from './json-logic-constraint.type';

/**
 * JSON logic constraint factory type. Represents a function that either
 * returns a constraint function, or an error string (when provided condition
 * is invalid).
 *
 * @typeParam K Condition key type.
 * @typeParam P Condition paramater/value type.
 * @typeParam Q Constraint parameter types.
 */
export type JsonLogicConstraintFactory<K extends number | string, P extends JsonValue, Q extends unknown[]> = (
  condition: JsonLogicCondition<K, P>
) => JsonLogicConstraint<Q> | string;
