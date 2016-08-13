This dependency-free function will take an object and convert it to a query string.

## Usage
The function takes a single parameter, an object. The object must contain _only strings and integers_ as it's properties as I can't think of a sensible way to do deep nesting for arrays/objects. 

```javascript
import toQueryString from 'obj-to-query-string';

var myObject = {
    a: 1,
    b: 'someString'
};

var params = toQueryString(myObject); // 'a=1&b=someString'
```
