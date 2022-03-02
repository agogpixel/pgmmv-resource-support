import type { JsonArray, JsonObject, JsonValue } from '@agogpixel/pgmmv-ts/api/types';

/**
 *
 * @param value
 * @returns
 */
function isArray(value: unknown) {
  return Array.isArray(value) && typeof value === 'object';
}

/**
 *
 * @param value
 * @returns
 */
function isObject(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 *
 * @param value
 * @returns
 */
function isString(value: unknown) {
  return typeof value === 'string';
}

/**
 *
 * @param value
 * @returns
 */
function isBoolean(value: unknown) {
  return typeof value === 'boolean';
}

/**
 *
 * @param value
 * @returns
 */
function isNumber(value: unknown) {
  return typeof value === 'number';
}

/**
 *
 * @param value
 * @returns
 */
function isNull(value: unknown) {
  return value === null && typeof value === 'object';
}

/**
 *
 * @param value
 * @returns
 */
function isNotNumber(value: unknown) {
  return typeof value === 'number' && isNaN(value);
}

/**
 *
 * @param value
 * @returns
 */
function isInfinity(value: unknown) {
  return typeof value === 'number' && !isFinite(value);
}

/**
 *
 * @param value
 * @returns
 */
function isDate(value: unknown) {
  return typeof value === 'object' && value !== null && typeof (value as unknown as Date).getMonth === 'function';
}

/**
 *
 * @param value
 * @returns
 */
function isUndefined(value: unknown) {
  return value === undefined && typeof value === 'undefined';
}

/**
 *
 * @param value
 * @returns
 */
function isFunction(value: unknown) {
  return typeof value === 'function';
}

/**
 *
 * @param value
 * @returns
 */
function isSymbol(value: unknown) {
  return typeof value === 'symbol';
}

/**
 *
 * @param value
 * @returns
 */
function restOfDataTypes(value: unknown) {
  return isNumber(value) || isString(value) || isBoolean(value);
}

/**
 *
 * @param value
 * @returns
 */
function ignoreDataTypes(value: unknown) {
  return isUndefined(value) || isSymbol(value);
}

/**
 *
 * @param value
 * @returns
 */
function nullDataTypes(value: unknown) {
  return isNotNumber(value) || isInfinity(value) || isNull(value);
}

/**
 *
 * @param value
 * @returns
 */
function arrayValuesNullTypes(value: unknown) {
  return isNotNumber(value) || isInfinity(value) || isNull(value) || ignoreDataTypes(value);
}

/**
 *
 * @param str
 * @param newline
 * @returns
 */
function removeComma(str: string, newline: boolean) {
  let tempArr: string[];

  if (!newline) {
    tempArr = str.split('');
  } else {
    tempArr = str.trimRight().split('');
  }

  tempArr.pop();

  return tempArr.join('') + (newline ? '\n' : '');
}

/**
 *
 * @param value
 * @param space
 * @param stringifyFunctions
 * @returns
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

    if (isSymbol(obj)) {
      return undefined;
    }

    if (isFunction(obj)) {
      if (stringifyFunctions) {
        const fnParts = (isFunction(obj?.toString) ? obj?.toString() : 'function')?.split('\n');
        return fnParts?.join(`${!indentSize ? '' : '\n' + ' '.repeat(indentSize)}`);
      }

      return undefined;
    }

    if (restOfDataTypes(obj)) {
      const passQuotes = isString(obj) ? `"` : '';
      return `${passQuotes}${obj}${passQuotes}`;
    }

    if (isArray(obj) || isObject(obj)) {
      if (seen.indexOf(obj) >= 0) {
        return `[seen ${isArray(obj) ? 'array' : 'object'}]`;
      }

      seen.push(obj);
    }

    if (isArray(obj)) {
      let arrStr = '';

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
