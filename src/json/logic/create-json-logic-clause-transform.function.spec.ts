import { createJsonLogicClauseTransform } from './create-json-logic-clause-transform.function';
import { JsonLogicClause } from './json-logic-clause.type';
import { JsonLogicConstraint } from './json-logic-constraint.type';

describe('createJsonLogicClauseTransform', () => {
  it('is a function', () => expect(typeof createJsonLogicClauseTransform).toEqual('function'));

  it('returns a function', () => expect(typeof createJsonLogicClauseTransform(() => 'test')).toEqual('function'));

  describe('function', () => {
    it("handles error string from constraint factory (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      const result = transform(['test', true]);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual('ROOT: test');
    });

    it("handles invalid JSON logic clause (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      let result = transform(5 as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual('ROOT: Invalid JSON logic clause type; expected object');

      result = transform(null as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual('ROOT: Invalid JSON logic clause type; expected object');
    });

    it('handles constraint factory trivial return constraint', () => {
      const transform = createJsonLogicClauseTransform(() => () => true);
      const result = transform(['test', {}]);
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
    });

    it("handles invalid JSON logic connective (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      let result = transform({} as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual(
        'ROOT: Invalid JSON logic connective object; expected only one connective (object key), found 0'
      );

      result = transform({ a: true, b: true } as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual(
        'ROOT: Invalid JSON logic connective object; expected only one connective (object key), found 2'
      );
    });

    it("handles invalid JSON logic sub-clause (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      let result = transform({ NOT: null } as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual(
        'ROOT.NOT: Invalid JSON logic sub-clauses; expected array of length 1 or greater'
      );

      result = transform({ NOT: [] });
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual(
        'ROOT.NOT: Invalid JSON logic sub-clauses; expected array of length 1 or greater'
      );
    });

    it("handles JSON logic NOT connective sub-clause of length greater than one (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      const result = transform({ NOT: [{}, {}] } as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual(
        'ROOT.NOT: Invalid JSON logic sub-clause for NOT connective; array of length 1 required'
      );
    });

    it('handles constraint factory trivial NOT constraint', () => {
      const transform = createJsonLogicClauseTransform(() => () => true);
      const result = transform({ NOT: [['test', {}]] });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
    });

    it("handles JSON logic binary connective sub-clauses of length less than two (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      const result = transform({ AND: [['test', {}]] } as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual(
        'ROOT.AND: Invalid JSON logic sub-clause for connective; expected array of length 2 or greater'
      );
    });

    it("handles unknown JSON logic connective (form of 'path: error')", () => {
      const transform = createJsonLogicClauseTransform(() => 'test');
      const result = transform({
        FAIL: [
          ['test', {}],
          ['test', {}]
        ]
      } as unknown as JsonLogicClause<string, boolean>);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(1);
      expect((result as string[])[0]).toEqual('ROOT.FAIL: Unknown connective: FAIL');
    });

    it('supports JSON logic AND connective', () => {
      const transform = createJsonLogicClauseTransform((condition) => () => condition[1] as boolean);
      let result = transform({
        AND: [
          ['_', true],
          ['_', true],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
      result = transform({
        AND: [
          ['_', true],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
    });

    it('supports JSON logic OR connective', () => {
      const transform = createJsonLogicClauseTransform((condition) => () => condition[1] as boolean);
      let result = transform({
        OR: [
          ['_', false],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
      result = transform({
        OR: [
          ['_', false],
          ['_', false],
          ['_', false]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
    });

    it('supports JSON logic NAND connective', () => {
      const transform = createJsonLogicClauseTransform((condition) => () => condition[1] as boolean);
      let result = transform({
        NAND: [
          ['_', true],
          ['_', true],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
      result = transform({
        NAND: [
          ['_', true],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
    });

    it('supports JSON logic NOR connective', () => {
      const transform = createJsonLogicClauseTransform((condition) => () => condition[1] as boolean);
      let result = transform({
        NOR: [
          ['_', false],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
      result = transform({
        NOR: [
          ['_', false],
          ['_', false],
          ['_', false]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
    });

    it('supports JSON logic XOR connective', () => {
      const transform = createJsonLogicClauseTransform((condition) => () => condition[1] as boolean);
      let result = transform({
        XOR: [
          ['_', false],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
      result = transform({
        XOR: [
          ['_', true],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
    });

    it('supports JSON logic XNOR connective', () => {
      const transform = createJsonLogicClauseTransform((condition) => () => condition[1] as boolean);
      let result = transform({
        XNOR: [
          ['_', false],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(false);
      result = transform({
        XNOR: [
          ['_', true],
          ['_', false],
          ['_', true]
        ]
      });
      expect(typeof result).toEqual('function');
      expect((result as JsonLogicConstraint<unknown[]>)()).toEqual(true);
    });
  });
});
