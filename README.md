# Typeh - JavaScript Type Helper Library [![npm version](https://img.shields.io/npm/v/typeh?style=flat-square)](https://www.npmjs.com/package/typeh)


> A lightweight JS utility for advanced type detection, validation, and enforcement.


<a href="https://github.com/jqrony/typeh/blob/main/LICENSE">
  <img src="https://img.shields.io/github/license/jqrony/typeh?style=flat-square&color=blue" alt="License">
</a>
<a href="https://github.com/indianmodassir">
  <img src="https://img.shields.io/badge/Author-Indian%20Modassir-blue?style=flat-square" alt="Author">
</a>
<a href="https://www.npmjs.com/package/typeh">
  <img src="https://img.shields.io/npm/dm/typeh?color=blue&style=flat-square" alt="Download">
</a>
<a href="https://www.jsdelivr.com/package/npm/typeh">
  <img src="https://img.shields.io/jsdelivr/npm/hm/typeh?style=flat-square" alt="jsDelivr Hits">
</a>


## Features

- Determine the detailed type of any value (including distinguishing between integers and floats)
- Validate values against expected types with detailed error messages
- Check for common type categories like scalar, numeric, countable, infinite, etc.
- Supports multiple types (e.g. `int|float`) in validation
- Works in browser and Node.js environments

---

## Installation

Since TH is a self-contained script, you can include it directly in your project.

```bash
npm install typeh --save
```

### Browser

Include the script in your HTML:

```html
<script src="path/to/th.js"></script>
```

OR

```js
// Node.js
require("typeh");
```

**isA Types**

- isCountable()
- isInteger()
- isDouble()
- isNumeric()
- isLong()
- isScalar()
- isInfinite()
- isString()
- isBool()
- isArray()
- isObject()
- isCallable()
- isIterable()
- isNull()
- isFalse()
- isTrue()

**Type List**
- int
- float
- string
- bool/boolean
- array
- object
- callable
- iterable
- mixed
- null
- false
- true

Others... Like (HTMLElement, regexp, symbol etc.) But support only in `define` method.

### Usage

**Variable**

```js
// Required
const arr = array([]);
const str = string('Hello World');
const fn = callable(() => {});
const isBool = bool(true);
const num = int(12);
const float = float(12.22);
const values = iterable(new Set([1,2,3,4]));
const obj = object({});
const data = mixed("Foo"); // Allow all types

/* Optional/Required */
function myFun(username, email, number, isAdult) {
  username = string(username); // [required]
  email = _string(email);      // [optional]
  number = _int(number);       // [optional]
  isAdult = bool(isAdult);     // [required]
}

myFun('Foo', null, null, true);
```

**How to use custom Type**
```js
const custom = define("string|array|bool", []); // Allow (string, array, boolean) only

// Optional
const optval = define("?string|array"); // Allow (string, array, null, undefined)
```

**Argument typeh**

```js
function select(selector, context, results, isSelf) {
  setType({
    string: selector,     // [required]
    HTMLElement: context, // [required]
    array: results,       // [required]
    "?bool": isSelf       // [optional]
  });
}
```

**How To Check Primitive Type**

```js
toType(/^[a-z]/);      // Output: regexp
toType(new Date);      // Output: date
toType('Hello');       // Output: string
toType(123);           // Output: number
toType(true);          // Output: boolean
toType(() => {});      // Output: function
toType([]);            // Output: array
toType({});            // Output: object
toType(new Error());   // Output: error
toType(Symbol('Foo')); // Output: symbol
```

**Check To Object Type**
```js
toType(12.21);         // Output: float
toType(123);           // Output: int
toType(/^[a-z]/);      // Output: regexp
toType('Hello');       // Output: string

const body = document.body;
toType(body); // Output: HTMLBodyElement
```