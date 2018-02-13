import ERROR_CODES from './error-codes';

export default (obj = {}) => {
    if(typeof obj !== 'object' || obj === null) {
        throw {
            code: ERROR_CODES.invalidObjectParam,
            message: `The object passed in can only contain string or number values for it's properties`
        }
    }

    let result = ``;
    const objKeys = Object.keys(obj);

    objKeys.forEach((key, i) => {
        let value = obj[key];

        if(typeof value !== 'string' && typeof value !== 'number' && !Array.isArray(value)) {
            throw {
                code: ERROR_CODES.invalidObjectProperty,
                message: `The object passed in can only contain a string, number, or an array of numbers/strings as values for it's properties`
            }
        }

        if(Array.isArray(value)) {
            value.forEach((val, j) => {
                if(typeof val !== 'string' && typeof val !== 'number') {
                    throw {
                        code: ERROR_CODES.invalidArrayValue,
                        message: `The array (${value}) can only contain string or numbers. ${val} is not a number or string.`
                    }
                }

                const encodedValue = encodeURIComponent(val);

                result += `${key}[]=${encodedValue}`;

                if(j !== value.length - 1) {
                    result += '&'
                }
            });
        } else {
            value = encodeURIComponent(value);
            result += `${key}=${value}`;
        }

        if(i !== objKeys.length - 1) {
            result += '&'
        }

    });

    return result;
}
