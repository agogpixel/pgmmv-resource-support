import { getStringByteLength } from './get-string-byte-length.function';

describe('getStringByteLength', () => {
  it('is a function', () => expect(typeof getStringByteLength).toBe('function'));

  it('returns 0 when string is empty', () => expect(getStringByteLength('')).toEqual(0));

  it("returns 4 when string is 'test'", () => expect(getStringByteLength('test')).toEqual(4));

  it("returns 4 when string is '🙂'", () => expect(getStringByteLength('🙂')).toEqual(4));

  it("returns 3 when string is 'ࢯ'", () => expect(getStringByteLength('ࢯ')).toEqual(3));

  it(`returns 2 when string is '${String.fromCodePoint(0x83)}' (code point 0x83)`, () =>
    expect(getStringByteLength(String.fromCodePoint(0x83))).toEqual(2));
});
