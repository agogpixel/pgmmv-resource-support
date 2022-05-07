/**
 * Exports to-JSON utility function.
 *
 * @module pgmmv-resource-support/json/to-json.function
 */

import type { JsonArray, JsonObject, JsonValue } from '@agogpixel/pgmmv-ts/api/types';

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
 * Custom JSON stringify method that can handle some non-JSON data types (Date,
 * Symbol, etc.). Capable of custom indent sizing & function stringification.
 *
 * Cycle safe - already visited references will result in "[seen object]" or
 * "[seen array]" string literals.
 *
 * @param value Value to convert to a JSON encoded string.
 * @param space Amount of space characters in an indent. 0 will result in a
 * single line.
 * @param stringifyFunctions Stringify functions?
 * @returns A JSON encoded string.
 * @public
 * @static
 */
export function toJson(value: JsonValue, space?: number, stringifyFunctions?: boolean) {
  const seen: unknown[] = [];

  const indentSize = typeof space === 'number' && space >= 0 ? space : 2;

  function parse(obj: JsonValue, indent: number) {
    if (ignoreDataTypes(obj)) {
      return undefined;
    }

    if (isDate(obj)) {
      return `"${(obj as unknown as Date).toISOString()}"`;
    }

    if (nullDataTypes(obj)) {
      return `${null}`;
    }

    if (isFunction(obj)) {
      if (stringifyFunctions) {
        const fnParts = (
          isFunction((obj as { toString: unknown }).toString)
            ? (obj as { toString: () => string }).toString()
            : '"function"'
        ).split('\n');
        return fnParts.join(`${!indentSize ? '' : '\n' + ' '.repeat(indentSize)}`);
      }

      return undefined;
    }

    if (restOfDataTypes(obj)) {
      const passQuotes = isString(obj) ? `"` : '';
      return `${passQuotes}${obj}${passQuotes}`;
    }

    if (isArray(obj) || isObject(obj)) {
      if (seen.indexOf(obj) >= 0) {
        return `"[seen ${isArray(obj) ? 'array' : 'object'}]"`;
      }

      seen.push(obj);
    }

    if (isArray(obj)) {
      let arrStr = '';

      if (!(obj as JsonArray).length) {
        return '[]';
      }

      (obj as JsonArray).forEach(function (eachValue) {
        arrStr +=
          ' '.repeat(indent + indentSize) +
          (arrayValuesNullTypes(eachValue) ? parse(null, indent + indentSize) : parse(eachValue, indent + indentSize));
        arrStr += ',' + (!indentSize ? '' : '\n');
      });

      return `[${!indentSize ? '' : '\n'}${removeComma(arrStr, !!indentSize)}${' '.repeat(indent)}]`;
    }

    if (isObject(obj)) {
      let objStr = '';

      const objKeys = Object.keys(obj as JsonObject);

      if (!objKeys.length) {
        return '{}';
      }

      objKeys.forEach(function (eachKey) {
        const eachValue = (obj as JsonObject)[eachKey] as JsonValue;
        objStr += !ignoreDataTypes(eachValue)
          ? `${' '.repeat(indent + indentSize)}"${eachKey}":${!indentSize ? '' : ' '}${parse(
              eachValue,
              indent + indentSize
            )},${!indentSize ? '' : '\n'}`
          : '';
      });

      return `{${!indentSize ? '' : '\n'}${removeComma(objStr, !!indentSize)}${' '.repeat(indent)}}`;
    }
  }

  return parse(value, 0);
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Test if specified value is an array.
 *
 * @param value Value to test.
 * @returns True when value is an array, false otherwise.
 * @private
 * @static
 */
function isArray(value: unknown) {
  return Array.isArray(value) && typeof value === 'object';
}

/**
 * Test if specified value is an object.
 *
 * @param value Value to test.
 * @returns True when value is a non-null & non-array object, false otherwise.
 * @private
 * @static
 */
function isObject(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Test if specified value is a string.
 *
 * @param value Value to test.
 * @returns True when value is a string, false otherwise.
 * @private
 * @static
 */
function isString(value: unknown) {
  return typeof value === 'string';
}

/**
 * Test if specified value is a boolean.
 *
 * @param value Value to test.
 * @returns True when value is a boolean, false otherwise.
 * @private
 * @static
 */
function isBoolean(value: unknown) {
  return typeof value === 'boolean';
}

/**
 * Test if specified value is a number.
 *
 * @param value Value to test.
 * @returns True when value is a number, false otherwise.
 * @private
 * @static
 */
function isNumber(value: unknown) {
  return typeof value === 'number';
}

/**
 * Test if specified value is null.
 *
 * @param value Value to test.
 * @returns True when value is null, false otherwise.
 * @private
 * @static
 */
function isNull(value: unknown) {
  return value === null && typeof value === 'object';
}

/**
 * Test if value is a number type, but invalid.
 *
 * @param value Value to test.
 * @returns True when value is a number type but invalid, false otherwise.
 * @private
 * @static
 */
function isNotNumber(value: unknown) {
  return typeof value === 'number' && isNaN(value);
}

/**
 * Test if value is infinity.
 *
 * @param value Value to test.
 * @returns True when value is infinity, false otherwise.
 * @private
 * @static
 */
function isInfinity(value: unknown) {
  return typeof value === 'number' && !isFinite(value);
}

/**
 * Test if value is a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
 * instance.
 *
 * @param value Value to test.
 * @returns True when value is a Date instance, false otherwise.
 * @private
 * @static
 */
function isDate(value: unknown) {
  return typeof value === 'object' && value !== null && typeof (value as unknown as Date).getMonth === 'function';
}

/**
 * Test if value is undefined.
 *
 * @param value Value to test.
 * @returns True when value is undefined, false otherwise.
 * @private
 * @static
 */
function isUndefined(value: unknown) {
  return value === undefined && typeof value === 'undefined';
}

/**
 * Test if value is a function.
 *
 * @param value Value to test.
 * @returns True when value is a function, false otherwise.
 * @private
 * @static
 */
function isFunction(value: unknown) {
  return typeof value === 'function';
}

/**
 * Test if value is a symbol.
 *
 * @param value Value to test.
 * @returns True when value is a symbol, false otherwise.
 * @private
 * @static
 */
function isSymbol(value: unknown) {
  return typeof value === 'symbol';
}

/**
 * Test if value is a number, string, or boolean.
 *
 * @param value Value to test.
 * @returns True when value is a number, string, or boolean. False otherwise.
 * @private
 * @static
 */
function restOfDataTypes(value: unknown) {
  return isNumber(value) || isString(value) || isBoolean(value);
}

/**
 * Test if value is undefined or a symbol.
 *
 * @param value Value to test.
 * @returns True when value is undefined or a symbol, false otherwise.
 * @private
 * @static
 */
function ignoreDataTypes(value: unknown) {
  return isUndefined(value) || isSymbol(value);
}

/**
 * Test if value is a number type (but invalid), infinity, or null.
 *
 * @param value Value to test.
 * @returns True when value is a number type (but invalid), infinity, or null.
 * False otherwise.
 * @private
 * @static
 */
function nullDataTypes(value: unknown) {
  return isNotNumber(value) || isInfinity(value) || isNull(value);
}

/**
 * Test if value is a number type (but invalid), infinity, null, undefined, or
 * symbol.
 *
 * @param value Value to test.
 * @returns True when value is a number type (but invalid), infinity, null,
 * undefined, or symbol. False otherwise.
 * @private
 * @static
 */
function arrayValuesNullTypes(value: unknown) {
  return nullDataTypes(value) || ignoreDataTypes(value);
}

/**
 * Remove a trailing comma from a string with trailing newline support.
 *
 * @param str String to remove comma from.
 * @param newline Account for trailing newline?
 * @returns A string with trailing comma removed.
 * @private
 * @static
 */
function removeComma(str: string, newline: boolean) {
  let tempArr: string[];

  if (!newline) {
    tempArr = str.split('');
  } else {
    tempArr = str.trimEnd().split('');
  }

  tempArr.pop();

  return tempArr.join('') + (newline ? '\n' : '');
}
