import test from 'tape';

import toQueryString from '../lib/index';
import ERROR_CODES from '../src/error-codes';

test('It returns an empty string if nothing is passed in', t => {
    var result = toQueryString();

    t.equal(result, '');
    t.end();
});

test('Returns a query string when an object is passed in: ', t => {
    var object = {
        a: 1,
        b: 'a string'
    };

    var result = toQueryString(object);

    t.equal(result, 'a=1&b=a%20string');
    t.end();
});

test('Throws an error if anything but an object is passed in', t => {
    // [1, 'two', () => {}, null, NaN];
    var params = [
        {
            name: 'Integer',
            value: 1
        },
        {
            name: 'String',
            value: 'string'
        },
        {
            name: 'Function',
            value: () => {}
        },
        {
            name: 'null',
            value: null
        }
    ];

    params.forEach(param => {
        let { name, value } = param;

        try {
            var result = toQueryString(value);

            t.fail(`Failed to throw an error when a param of type '${name}' is passed in`);
            t.end();
        } catch (e) {
            t.comment(`Throws an error if param is equal to '${name}'`);
            t.equal(e.code, ERROR_CODES.invalidObjectParam);
        }
    });

    t.end();
});

test('Throws an error if an object passed in has any properties but an integer or string', t => {
    var props = [
        {
            name: 'Array',
            value: []
        },
        {
            name: 'Object',
            value: {}
        },
        {
            name: 'Function',
            value: () => {}
        },
        {
            name: 'null',
            value: null
        },
        {
            name: 'undefined',
            value: undefined
        }
    ];

    props.forEach(prop => {
        let { name, value } = prop;

        try {
            var result = toQueryString({
                name: value
            });

            t.fail(`Failed to throw an error when the object param supplied has a type of '${name}' as a property`);
            t.end();
        } catch (e) {
            t.comment(`Throws an error if object param contains a '${name}'`);
            t.equal(e.code, ERROR_CODES.invalidObjectProperty);
        }
    });

    t.end();
});
