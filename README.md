This dependency-free function will take an object and convert it to a query string.

## Installation
In the root of your project, run:
```shell
yarn add obj-to-query-string
```

## Usage
The function takes a single parameter, an object. The object must contain _only strings, numbers, or an array of numbers/strings_ as it's properties as I can't think of a sensible way to do deep nesting for objects. 

```javascript
import toQueryString from 'obj-to-query-string';

const myObject = {
    a: 1,
    b: 'some string',
    anArray: [1, 'some other string']
};

const params = toQueryString(myObject); // 'a=1&b=some%20string&anArray[]=1&anArray[]=some%20other%20string'
```
