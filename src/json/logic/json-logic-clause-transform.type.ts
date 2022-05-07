/**
 * Exports JSON logic clause transform type.
 *
 * @module json/logic/json-logic-clause-transform.type
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { JsonLogicClause } from './json-logic-clause.type';
import type { JsonLogicConstraint } from './json-logic-constraint.type';

/**
 * JSON logic clause transform type. Represents a function that accepts a clause
 * and either returns a constraint function, or an array of error messages (when
 * provided clause is invalid).
 *
 * @typeParam K Clause key type.
 * @typeParam P Clause paramater/value type.
 * @typeParam Q Constraint parameter types.
 */
export type JsonLogicClauseTransform<K extends number | string, P extends JsonValue, Q extends unknown[]> = (
  clause: JsonLogicClause<K, P>
) => JsonLogicConstraint<Q> | string[];
