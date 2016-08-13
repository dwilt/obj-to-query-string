This is a simple, standalone js utility function to convert a js object to a serialized query string. I couldn't find one on the web that was easy to install and wasn't tied to jQuery, so I wrote my own.

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
