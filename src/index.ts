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
      value !== undefined
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

function isValidValue(val: number | string) {
  return typeof val === "number" || (typeof val === "string" && !!val.length);
}

/** This function will take an object of values and covert them to a query string used in a URL (typically for a GET request) */
export default function(paramObject: ParamObject = {}): QueryString {
  checkIfObjectisValid(paramObject);

  const paramObjectKeys = Object.keys(paramObject);

  return paramObjectKeys.reduce((current, key, i) => {
    let value = paramObject[key];

    if (value === undefined) {
      return "";
    }

    if (Array.isArray(value)) {
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
