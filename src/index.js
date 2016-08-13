import ERROR_CODES from './error-codes';

export default (obj = {}) => {
    if(typeof obj !== 'object' || obj === null) {
        throw {
            code: ERROR_CODES.invalidObjectParam,
            message: `The object passed in can only contain string or number values for it's properties`
        }
    }

    var result = '';

    for(var key in obj) {
        let value = obj[key];

        if(typeof value !== 'string' && typeof value !== 'number') {
            throw {
                code: ERROR_CODES.invalidObjectProperty,
                message: `The object passed in can only contain string or number values for it's properties`
            }
        }

        value = encodeURIComponent(value);

        result += `${key}=${value}&`;
    }

    return result.slice(0, result.length - 1);
}
