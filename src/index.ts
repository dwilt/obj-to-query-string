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

  Object.keys(paramObject).forEach((key, i) => {
    let value = paramObject[key];

    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      !Array.isArray(value)
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

/** This function will take an object of values and covert them to a query string used in a URL (typically for a GET request) */
export default function(paramObject: ParamObject = {}): QueryString {
  checkIfObjectisValid(paramObject);

  const paramObjectKeys = Object.keys(paramObject);

  return paramObjectKeys.reduce((current, key, i) => {
    let value = paramObject[key];

    if (Array.isArray(value)) {
      value.forEach((val, j) => {
        const encodedValue = encodeURIComponent(val.toString());

        current += `${key}[]=${encodedValue}`;

        // @ts-ignore
        if (j !== value.length - 1) {
          current += "&";
        }
      });
    } else {
      value = encodeURIComponent(value.toString());
      current += `${key}=${value}`;
    }

    if (i !== paramObjectKeys.length - 1) {
      current += "&";
    }

    return current;
  }, "");
}
