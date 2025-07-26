/**
 * typeh JavaScript Library v1.0.1
 * Lightweight JS library for type detection, validation, and enforcement
 * https://github.com/jqrony/typeh
 * 
 * Released under the MIT license
 * https://github.com/jqrony/typeh/blob/main/LICENSE
 * 
 * @author Indian Modassir
 * 
 * Date: 17-07-2025 11:10 PM
 */
(function(global, factory) {

"use strict";
factory(global);

})(typeof globalThis !== "undefined" ? globalThis: this, function(global) {

"use strict";

var typeh = {};
var class2type = {};
var toString = class2type.toString;
var types = "int|float|string|bool|array|object|callable|iterable|mixed|null|false|true".split("|");
var define;

/**
 * Returns the type of the given object as a string.
 * Handles null and undefined correctly by returning "null" or "undefined".
 * For objects and functions, attempts to map their internal class to a string.
 * Falls back to typeof operator if no mapping found.
 * 
 * @param {*} obj The value to check the type of
 * @returns {string} The type of the object as a string
 */
function isType(obj) {
  if (obj == null) {
    return obj + "";
  }

  // Return the mapped internal class name or "object"
  return typeof obj === "object" || typeof obj === "function" ?
    class2type[toString.call(obj)] || "object" :
    typeof obj;
}

/**
 * Provides a more detailed type classification of the input,
 * distinguishing integers from floats, and returning normalized types.
 * 
 * @param {*} obj The value to determine the type for
 * @returns {string} Normalized type string such as "int", "float", etc.
 */
function toType(obj) {
  var type, construct,
    rfloat = /^-?\d*\.\d+$/;

  if (obj == null) {
    return obj + "";
  }

  // Attempt to get the constructor name or fallback to
  // Object.prototype.toString call
  type = ((construct = obj.constructor) && construct.name ||
    Object.prototype.toString.call(obj).slice(8, -1))
    .toLowerCase();

  // Normalize number type to "int" initially
  if (type === "number") {
    type = "int";
  }

  // Detect float if the number contains decimals or is not an integer
  if (type === "int" && isFinite(obj) && (rfloat.test(obj) || !Number.isInteger(obj))) {
    type = "float";
  }

  return type;
}

/**
 * Checks if the given object matches one of the specified types.
 * Types can be a pipe-separated string like "int|float|array".
 * Handles special cases like "callable" (function) and "iterable" (objects with Symbol.iterator).
 * Also handles boolean values as "true" or "false" strings.
 * 
 * @param {string} type Type(s) to match against (e.g., "int|float")
 * @param {*} obj The object to test
 * @returns {boolean} True if object matches any of the specified types, else false
 */
function typeMatches(type, obj) {
  var types, ofType,
    optinal = type.slice(0, 1) === "?",
    matched = false;

  if (optinal) {
    type = type.slice(1);
    if (obj == null) {
      matched = true;
    }
  }

  types = type.split("|");
  ofType = toType(obj);

  for(type of types) {
    type = type.toLowerCase();

    // HTMLElement
    if (obj && obj.nodeType === 1 &&
      type === "htmlelement" && obj instanceof HTMLElement) {
      matched = true;
      break;
    }

    // Callable
    if (type === "callable" && ofType === "function") {
      matched = true;
      break;
    }

    // Iterable
    if (type === "iterable") {
      matched = obj != null && typeof obj[Symbol.iterator] === "function";
      break;
    }

    // Boolean
    if ((typeof obj === "boolean" && type === (obj + "")) || type === ofType.slice(0, 4)) {
      matched = true;
      break;
    }

    // Mixed|Others
    if ((type === ofType || type === isType(obj)) || type === "mixed") {
      matched = true;
      break;
    }
  }

  return matched;
}

/**
 * Validates that a value matches the expected type(s) and returns it.
 * Throws an Error if the type does not match.
 * 
 * @param {Object} options An object with keys as types and values as values to validate
 */
typeh.setType = function(options) {
  var type;
  for(type in options) define(type, options[type]);
};

/**
 * Validates that a single object matches the expected type.
 * Throws an Error if the validation fails.
 * 
 * @param {string} type Expected type(s), pipe-separated string
 * @param {*} obj The value to check
 * @returns {*} The validated object (if type matches)
 * @throws {Error} If the type does not match
 */
define = typeh.define = function(type, obj) {

  if (!typeMatches(type, obj)) {
    throw new Error("The value must be of type [" + type + "], [" + toType(obj) + "] given.");
  }

  return obj;
};

/**
 * Checks if the object is countable, meaning it has a length property that is an integer,
 * or is an array, Map, or Set instance.
 * 
 * @param {*} obj The object to check
 * @returns {boolean} True if countable, otherwise false
 */
typeh.isCountable = function(obj) {
  return isArray(obj) ||
    obj instanceof Map || obj instanceof Set ||
    (obj != null && isObject(obj) && isInteger(obj.length));
};

/**
 * Checks if the object is an integer.
 * 
 * @param {*} obj The value to check
 * @returns {boolean} True if integer, false otherwise
 */
typeh.isInteger = function(obj) {
  return isInt(obj);
};

 /**
 * Checks if the object is a floating point number (double).
 * 
 * @param {*} obj The value to check
 * @returns {boolean} True if float, false otherwise
 */
typeh.isDouble = function(obj) {
  return isFloat(obj);
};

 /**
 * Checks if the object is numeric, i.e., an integer or a numeric string.
 * Uses parseFloat to verify numeric nature.
 * 
 * @param {*} obj The value to check
 * @returns {boolean} True if numeric, false otherwise
 */
typeh.isNumeric = function(obj) {
  return (isInt(obj) || isString(obj)) && !isNaN(obj - parseFloat(obj));
};

 /**
 * Checks if the object is a "long" integer (in JavaScript terms, a safe integer).
 * 
 * @param {*} obj The value to check
 * @returns {boolean} True if a safe integer, false otherwise
 */
typeh.isLong = function(obj) {
  return isInteger(obj) && Number.isInteger(obj);
};

/**
 * Checks if the value is scalar: a string, boolean, or finite number.
 * 
 * @param {*} obj The value to check
 * @returns {boolean} True if scalar, false otherwise
 */
typeh.isScalar = function(obj) {
  return typeMatches("string|bool", obj) || typeof obj === "number" && isFinite(obj);
};

/**
 * Checks if the value is infinite (positive or negative Infinity).
 * 
 * @param {*} obj The value to check
 * @returns {boolean} True if infinite, false otherwise
 */
typeh.isInfinite = function(obj) {
  return obj === Infinity || obj === -Infinity;
};

/**
 * Helper to iterate over an array and execute a callback on each element.
 * 
 * @param {array} array The array to iterate over
 * @param {Function} callback The function to call on each element (element, index)
 */
function Each(array, callback) {
  for(var i = 0; i < array.length; i++) callback(array[i], i);
}

// Populate class2type map
Each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
function(name) {
  class2type["[" + "object " + name + "]"] = name.toLowerCase();
});


Each(types, function(type) {

  typeh["_" + type] = function(obj) {
    return define("?" + type, obj);
  };

  typeh[type] = function(obj) {
    return define(type, obj);
  };
  
  if (type !== "mixed") {
    typeh["is" + type[0].toUpperCase() + type.slice(1)] = function(obj) {
      return typeMatches(type, obj);
    };
  }
});

// Expose the primary type functions for external use
typeh.toType = toType;
typeh.isType = isType;

// Merge all typeh functions onto the global object (e.g., window or globalThis)
Object.assign(global, typeh);

/* EXPOSE */
if (typeof module !== "undefined" && module.exports) {
  module.exports = typeh;
}
else {
  window.typeh = typeh;
}

/* EXPOSE */

});