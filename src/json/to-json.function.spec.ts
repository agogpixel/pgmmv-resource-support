import { toJson } from './to-json.function';

describe('toJson', () => {
  it('is a function', () => expect(typeof toJson).toBe('function'));

  it('returns undefined when value is undefined', () => expect(toJson(undefined as unknown as string)).toBeUndefined());

  it('returns undefined when value is a Symbol', () => expect(toJson(Symbol() as unknown as string)).toBeUndefined());

  it('returns quote-wrapped ISO string when value is a Date', () =>
    expect(toJson(new Date(628021800000) as unknown as string)).toEqual('"1989-11-25T18:30:00.000Z"'));

  it('returns null string when value is null', () => expect(toJson(null)).toEqual('null'));

  it('returns undefined when value is a function and stringifyFunctions is false', () =>
    expect(
      toJson(function () {
        return;
      } as unknown as string)
    ).toBeUndefined());

  it('returns function string when value is a function and stringifyFunctions is true', () =>
    expect(
      toJson(
        function () {
          return;
        } as unknown as string,
        undefined,
        true
      )
    ).toEqual('function () {\n              return;\n          }'));

  it('returns quote-wrapped function string literal when value is a function but is missing a toString method', () => {
    function testFn() {
      return;
    }

    testFn.toString = undefined as unknown as () => string;
    expect(toJson(testFn as unknown as string, undefined, true)).toEqual('"function"');
  });

  it('returns function string when value is a function and indent is 0', () =>
    expect(
      toJson(
        function () {
          return;
        } as unknown as string,
        0,
        true
      )
    ).toEqual('function () {            return;        }'));

  it('returns quote-wrapped string when value is a string', () =>
    expect(toJson('Hello World!')).toEqual('"Hello World!"'));

  it('returns number string when value is a number', () => expect(toJson(17)).toEqual('17'));

  it('returns boolean string when value is a boolean', () => {
    expect(toJson(true)).toEqual('true');
    expect(toJson(false)).toEqual('false');
  });

  it('returns empty array string when value is an empty array', () => expect(toJson([])).toEqual('[]'));

  it('returns array string when value is an array of primitives', () =>
    expect(toJson([1, true, 'test', null])).toEqual('[\n  1,\n  true,\n  "test",\n  null\n]'));

  it('returns array string when value is an array of primitives (0-indent)', () =>
    expect(toJson([1, true, 'test', null], 0)).toEqual('[1,true,"test",null]'));

  it('returns empty object string when value is an empty object', () => expect(toJson({})).toEqual('{}'));

  it('returns object string when value is an object containing primitives', () =>
    expect(toJson({ a: 1, b: true, c: 'test', d: null, e: undefined })).toEqual(
      '{\n  "a": 1,\n  "b": true,\n  "c": "test",\n  "d": null\n}'
    ));

  it('returns object string when value is an object containing primitives (0-indent)', () =>
    expect(toJson({ a: 1, b: true, c: 'test', d: null, e: undefined }, 0)).toEqual(
      '{"a":1,"b":true,"c":"test","d":null}'
    ));

  it('handles seen objects', () => {
    const test = { a: true, b: undefined };
    test['b'] = test as unknown as undefined;

    expect(toJson(test)).toEqual('{\n  "a": true,\n  "b": "[seen object]"\n}');
  });

  it('handles seen arrays', () => {
    const test = [true];
    test.push(test as unknown as boolean);

    expect(toJson(test)).toEqual('[\n  true,\n  "[seen array]"\n]');
  });
});
