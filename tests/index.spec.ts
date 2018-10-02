import * as test from "tape";

import objToQueryString, { ParamError, removeEmpty } from "../src/index";

test("removeEmpty will remove undefined and null values", t => {
  const result = removeEmpty({
    a: undefined,
    b: "something",
    c: undefined,
    d: [undefined, null, 1]
  });

  t.deepEqual(result, { b: "something", d: [1] });
  t.end();
});

test("It returns an empty string if nothing is passed in", t => {
  const result = objToQueryString();

  t.equal(result, "");
  t.end();
});

test(`It returns a query string when an integer is passed in`, t => {
  const object = {
    a: 1
  };

  const result = objToQueryString(object);

  t.equal(result, "a=1");
  t.end();
});

test(`It can handle an integer as a key`, t => {
  const object = {
    3: 1
  };

  const result = objToQueryString(object);

  t.equal(result, "3=1");
  t.end();
});

test(`It can handle multiple integers by splitting them up with a &`, t => {
  const object = {
    a: 1,
    b: 2
  };

  const result = objToQueryString(object);

  t.equal(result, "a=1&b=2");
  t.end();
});

test(`It will clear out empty strings and arrays`, t => {
  const object = {
    a: "",
    b: "hey",
    c: []
  };

  const result = objToQueryString(object);

  t.equal(result, "b=hey");
  t.end();
});

test(`It will clear out undefined values`, t => {
  const object = {
    a: undefined,
    b: "hey"
  };

  const result = objToQueryString(object);

  t.equal(result, "b=hey");
  t.end();
});

test(`It will handle strings by URI encoding them`, t => {
  const object = {
    a: "a string",
    b: "another string"
  };

  const result = objToQueryString(object);

  t.equal(result, "a=a%20string&b=another%20string");
  t.end();
});

test(`It can handle a string as a key`, t => {
  const object: {
    [key: string]: string;
  } = {
    a: "a string"
  };

  object["string-key"] = "another string";

  const result = objToQueryString(object);

  t.equal(result, "a=a%20string&string-key=another%20string");
  t.end();
});

test(`It will handle an array of numbers by creating the format 'arrayName[]=val1&arrayName[]=val2`, t => {
  const object = {
    a: [1, 2, 3]
  };

  const result = objToQueryString(object);

  t.equal(result, "a[]=1&a[]=2&a[]=3");
  t.end();
});

test(`It will handle an array of strings by creating the format 'arrayName[]=val1&arrayName[]=val2`, t => {
  const object = {
    a: ["a string", "the second string", "the third string"]
  };

  const result = objToQueryString(object);

  t.equal(
    result,
    "a[]=a%20string&a[]=the%20second%20string&a[]=the%20third%20string"
  );
  t.end();
});

test(`It will handle integers, strings, and multiple array of strings of strings/numbers by creating the format 'arrayName[]=val1&arrayName[]=val2`, t => {
  const object = {
    a: ["a string", "the second string", "the third string", 2],
    b: 3,
    c: "a string by itself",
    4: [1, "more", "array of stuff"]
  };

  const result = objToQueryString(object);

  t.equal(
    result,
    "4[]=1&4[]=more&4[]=array%20of%20stuff&a[]=a%20string&a[]=the%20second%20string&a[]=the%20third%20string&a[]=2&b=3&c=a%20string%20by%20itself"
  );
  t.end();
});

// error handling

test("Throws an error if anything but an object is passed in", t => {
  // [1, 'two', () => {}, null, NaN];
  const params = [
    {
      name: "Integer",
      value: 1
    },
    {
      name: "String",
      value: "string"
    },
    {
      name: "Function",
      value: () => {}
    },
    {
      name: "null",
      value: null
    }
  ];

  params.forEach(param => {
    let { name, value } = param;

    try {
      // @ts-ignore
      const result = objToQueryString(value);

      t.fail(
        `Failed to throw an error when a param of type '${name}' is passed in`
      );
      t.end();
    } catch (e) {
      t.comment(`Throws an error if param is equal to '${name}'`);
      t.equal(e.code, ParamError.invalidObjectParam);
    }
  });

  t.end();
});

test("Throws an error if an object passed in has any properties but an integer, string, or array of numbers/strings", t => {
  const props = [
    {
      name: "Object",
      value: {}
    },
    {
      name: "Function",
      value: () => {}
    }
  ];

  props.forEach(prop => {
    let { name, value } = prop;

    try {
      // @ts-ignore
      const result = objToQueryString({ name: value });

      t.fail(
        `Failed to throw an error when the object param supplied has a type of '${name}' as a property`
      );
      t.end();
    } catch (e) {
      t.comment(`Throws an error if object param contains a '${name}'`);
      t.equal(e.code, ParamError.invalidObjectProperty);
    }
  });

  t.end();
});

test("Throws an error if an array has anything but a number or string", t => {
  const props = [
    {
      name: "Object",
      value: [1, 2, {}]
    },
    {
      name: "Function",
      value: ["a string", () => {}]
    }
  ];

  props.forEach(prop => {
    let { name, value } = prop;

    try {
      // @ts-ignore
      const result = objToQueryString({ name: value });

      t.fail(
        `Failed to throw an error when an array param contains a '${name}'`
      );
      t.end();
    } catch (e) {
      t.comment(`Throws an error if the array contains '${name}'`);
      t.equal(e.code, ParamError.invalidArrayValue);
    }
  });

  t.end();
});
