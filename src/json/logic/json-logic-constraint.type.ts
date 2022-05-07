/**
 * Exports JSON logic constraint type.
 *
 * @module json/logic/json-logic-constraint.type
 */

/**
 * JSON logic constraint type.
 *
 * @typeParam P Constraint parameter types.
 */
export type JsonLogicConstraint<P extends unknown[]> = (...args: P) => boolean;
