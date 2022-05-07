/**
 * Exports JSON logic clause transform factory function.
 *
 * @module json/logic/json-logic-clause-transform.function
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { JsonLogicClauseTransform } from './json-logic-clause-transform.type';
import type { JsonLogicClause } from './json-logic-clause.type';
import { JsonLogicConnective } from './json-logic-connective.enum';
import type { JsonLogicConstraintFactory } from './json-logic-constraint-factory.type';
import type { JsonLogicConstraint } from './json-logic-constraint.type';

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
 * Create a JSON logic clause transform function based on specified constraint
 * factory.
 *
 * @typeParam K Clause key type.
 * @typeParam P Clause paramater/value type.
 * @typeParam Q Constraint parameter types.
 * @param constraintFactory Function that generats constraints from
 * clauses/conditions.
 * @returns JSON logic clause transform function.
 * @public
 * @static
 */
export function createJsonLogicClauseTransform<K extends number | string, P extends JsonValue, Q extends unknown[]>(
  constraintFactory: JsonLogicConstraintFactory<K, P, Q>
): JsonLogicClauseTransform<K, P, Q> {
  return function transformJsonLogicClause(clause: JsonLogicClause<K, P>) {
    const errors: string[] = [];

    function errorResult() {
      return false;
    }

    function parseJsonLogicClause(clause: JsonLogicClause<K, P>, path: string): JsonLogicConstraint<Q> {
      if (Array.isArray(clause)) {
        const result = constraintFactory(clause);

        if (typeof result === 'string') {
          errors.push(`${path}: ${result}`);
          return errorResult;
        }

        return result;
      }

      if (typeof clause !== 'object' || clause === null) {
        errors.push(`${path}: Invalid JSON logic clause type; expected object`);
        return errorResult;
      }

      const connectives = Object.keys(clause);

      if (connectives.length !== 1) {
        errors.push(
          `${path}: Invalid JSON logic connective object; expected only one connective (object key), found ${connectives.length}`
        );
        return errorResult;
      }

      const connective = connectives[0] as JsonLogicConnective;
      const subClauses = (clause as unknown as Record<JsonLogicConnective, JsonLogicClause<K, P>>)[connective];

      const currentPath = `${path}.${connective}`;

      if (!Array.isArray(subClauses) || subClauses.length < 1) {
        errors.push(`${currentPath}: Invalid JSON logic sub-clauses; expected array of length 1 or greater`);
        return errorResult;
      }

      if (connective === JsonLogicConnective.Not) {
        if (subClauses.length > 1) {
          errors.push(
            `${currentPath}: Invalid JSON logic sub-clause for ${JsonLogicConnective.Not} connective; array of length 1 required`
          );
          return errorResult;
        }

        const innerConstraint = parseJsonLogicClause(
          subClauses[0] as unknown as JsonLogicClause<K, P>,
          `${currentPath}[0]`
        );

        return function (...args: Q) {
          return !innerConstraint(...args);
        };
      }

      if (subClauses.length < 2) {
        errors.push(
          `${currentPath}: Invalid JSON logic sub-clause for connective; expected array of length 2 or greater`
        );
        return errorResult;
      }

      const subConstraints: JsonLogicConstraint<Q>[] = [];

      switch (connective) {
        case JsonLogicConnective.And:
        case JsonLogicConnective.Or:
        case JsonLogicConnective.Nand:
        case JsonLogicConnective.Nor:
        case JsonLogicConnective.Xor:
        case JsonLogicConnective.Xnor:
          for (let i = 0; i < subClauses.length; ++i) {
            subConstraints.push(parseJsonLogicClause(subClauses[i] as JsonLogicClause<K, P>, `${currentPath}[${i}]`));
          }
          break;
        default:
          errors.push(`${currentPath}: Unknown connective: ${connective}`);
          return errorResult;
      }

      switch (connective) {
        case JsonLogicConnective.And:
          return function (...args: Q) {
            for (let i = 0; i < subConstraints.length; ++i) {
              if (!subConstraints[i](...args)) {
                return false;
              }
            }
            return true;
          };
        case JsonLogicConnective.Or:
          return function (...args: Q) {
            for (let i = 0; i < subConstraints.length; ++i) {
              if (subConstraints[i](...args)) {
                return true;
              }
            }
            return false;
          };
        case JsonLogicConnective.Nand:
          return function (...args: Q) {
            for (let i = 0; i < subConstraints.length; ++i) {
              if (!subConstraints[i](...args)) {
                return true;
              }
            }
            return false;
          };
        case JsonLogicConnective.Nor:
          return function (...args: Q) {
            for (let i = 0; i < subConstraints.length; ++i) {
              if (subConstraints[i](...args)) {
                return false;
              }
            }
            return true;
          };
        case JsonLogicConnective.Xor:
          return function (...args: Q) {
            let trueCount = 0;
            for (let i = 0; i < subConstraints.length; ++i) {
              if (subConstraints[i](...args)) {
                ++trueCount;
              }
            }
            return trueCount % 2 === 1;
          };
        case JsonLogicConnective.Xnor:
          return function (...args: Q) {
            let trueCount = 0;
            for (let i = 0; i < subConstraints.length; ++i) {
              if (subConstraints[i](...args)) {
                ++trueCount;
              }
            }
            return trueCount % 2 === 0;
          };
      }
    }

    const result = parseJsonLogicClause(clause, 'ROOT');
    return !errors.length ? result : errors;
  };
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

// None.
