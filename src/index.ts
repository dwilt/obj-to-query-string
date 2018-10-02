export type QueryString = string;

export interface ParamObject {
  [key: string]: string | number | (string | number)[];
}

export enum ParamError {
  invalidObjectParam = "INVALID_OBJECT",
  invalidObjectProperty = "INVALID_OBJECT_PROPERTY",
  invalidArrayValue = "INVALID_ARRAY_VALUE"
}

function checkIfObjectisValid(paramObject: ParamObject): void {
  if (typeof paramObject !== "object" || paramObject === null) {
    throw {
      code: ParamError.invalidObjectParam,
      message: `This function can only take an object as it's parameter`
    };
  }

  Object.keys(paramObject).forEach(key => {
    let value = paramObject[key];

    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      !Array.isArray(value) &&
      value !== undefined &&
      value !== null
    ) {
      throw {
        code: ParamError.invalidObjectProperty,
        message: `${value} is not valid a value property. The object passed in can only contain a string, number, or an array of numbers/strings as values for it's properties`
      };
    }

    if (Array.isArray(value)) {
      value.forEach((val, j) => {
        if (typeof val !== "string" && typeof val !== "number") {
          throw {
            code: ParamError.invalidArrayValue,
            message: `The array (${value}) can only contain string or numbers. ${val} is not a number or string.`
          };
        }
      });
    }
  });
}

export function isValidValue(val: number | string) {
  return typeof val === "number" || (typeof val === "string" && !!val.length);
}

/** This function removes any undefined/null properties from an object as well as any undefined/null values in any arrays on the object */
export function removeEmpty(
  obj: {
    [key: string]: any;
  } = {}
): {} {
  const newObj: {
    [key: string]: any;
  } = {};

  return Object.keys(obj).reduce((current, key) => {
    if (Array.isArray(obj[key]) && obj[key].length > 0) {
      current[key] = obj[key].filter(val => isValidValue(val));

      if (current[key].length === 0) {
        delete current[key];
      }
    } else if (isValidValue(obj[key])) {
      current[key] = obj[key];
    }

    return current;
  }, newObj);
}

/**
 * This function will take an object of values and covert them to a query string
 * @constructor
 * @param {object} paramObject - An object comprised of strings, numbers and arrays of strings/numbers.
 * @example
 * // returns name=Dan&age=32&favoriteColors[]=blue&favoriteColors[]=red
 * objToQueryString({ name: 'Dan', age: 32, middleName: undefined, favoriteColors=['blue', 'red'], kids: null });
 */
export default function(paramObject: ParamObject = {}): QueryString {
  checkIfObjectisValid(paramObject);

  const cleanedObject = removeEmpty(paramObject);
  const paramObjectKeys = Object.keys(cleanedObject);

  return paramObjectKeys.reduce((current, key, i) => {
    let value = paramObject[key];

    if (Array.isArray(value)) {
      if (!!value.length) {
        value.forEach((arrayValue, j) => {
          const stringedValue = arrayValue.toString();

          if (isValidValue(stringedValue)) {
            const encodedValue = encodeURIComponent(stringedValue);

            current += `${key}[]=${encodedValue}`;

            // @ts-ignore
            if (j !== value.length - 1) {
              current += "&";
            }
          }
        });

        if (i !== paramObjectKeys.length - 1) {
          current += "&";
        }
      }
    } else {
      const stringedValue = value.toString();

      if (isValidValue(stringedValue)) {
        value = encodeURIComponent(stringedValue);
        current += `${key}=${value}`;

        if (i !== paramObjectKeys.length - 1) {
          current += "&";
        }
      }
    }

    return current;
  }, "");
}
