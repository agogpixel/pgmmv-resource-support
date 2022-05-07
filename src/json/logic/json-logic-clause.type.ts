/**
 * Exports JSON logic clause type.
 *
 * @module pgmmv-resource-support/json/logic/json-logic-clause.type
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { JsonLogicCondition } from './json-logic-condition.type';
import type { JsonLogicConnective } from './json-logic-connective.enum';

/**
 * JSON logic clause type.
 */
export type JsonLogicClause<K extends number | string, P extends JsonValue> =
  | JsonLogicCondition<K, P>
  | { [JsonLogicConnective.Not]: JsonLogicClause<K, P>[] }
  | { [JsonLogicConnective.And]: JsonLogicClause<K, P>[] }
  | { [JsonLogicConnective.Or]: JsonLogicClause<K, P>[] }
  | { [JsonLogicConnective.Nand]: JsonLogicClause<K, P>[] }
  | { [JsonLogicConnective.Nor]: JsonLogicClause<K, P>[] }
  | { [JsonLogicConnective.Xor]: JsonLogicClause<K, P>[] }
  | { [JsonLogicConnective.Xnor]: JsonLogicClause<K, P>[] };
