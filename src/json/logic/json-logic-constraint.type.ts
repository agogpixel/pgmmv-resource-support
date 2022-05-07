/**
 * Exports JSON logic constraint type.
 *
 * @module pgmmv-resource-support/json/logic/json-logic-constraint.type
 */

/**
 * JSON logic constraint type.
 */
export type JsonLogicConstraint<P extends unknown[]> = (...args: P) => boolean;
