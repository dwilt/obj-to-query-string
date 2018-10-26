export type QueryString = string;

export type ValidValue = string | number | boolean | null | undefined;

export interface ParamObject {
  [key: string]: ValidValue | ValidValue[];
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

    if (Array.isArray(value)) {
      value.forEach((val, j) => {
        if (!isValidValue(val)) {
          throw {
            code: ParamError.invalidArrayValue,
            message: `The array (${value}) can only contain string or numbers. ${val} is not a number or string.`
          };
        }
      });
    } else if (!isValidValue(value)) {
      throw {
        code: ParamError.invalidObjectProperty,
        message: `${value} is not valid a value property. The object passed in can only contain a string, number, or an array of numbers/strings as values for it's properties`
      };
    }
  });
}

function isEmptyValue(val: any) {
  return (
    val === "" ||
    (Array.isArray(val) && val.length === 0) ||
    val === null ||
    val === undefined
  );
}

export function isValidValue(val: ValidValue) {
  return (
    typeof val === "number" ||
    typeof val === "string" ||
    typeof val === "boolean" ||
    val === null ||
    val === undefined
  );
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
    if (!isEmptyValue(obj[key])) {
      if (Array.isArray(obj[key])) {
        current[key] = obj[key].filter(val => !isEmptyValue(val));

        if (current[key].length === 0) {
          delete current[key];
        }
      } else {
        current[key] = obj[key].toString();
      }
    }

    return current;
  }, newObj);
}

/**
 * This function will take an object of values and covert it to a query string
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
