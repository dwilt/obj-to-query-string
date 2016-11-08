(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _errorCodes = __webpack_require__(1);

	var _errorCodes2 = _interopRequireDefault(_errorCodes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) {
	        throw {
	            code: _errorCodes2.default.invalidObjectParam,
	            message: 'The object passed in can only contain string or number values for it\'s properties'
	        };
	    }

	    var result = '',
	        objKeys = Object.keys(obj);

	    objKeys.forEach(function (key, i) {
	        var value = obj[key];

	        if (typeof value !== 'string' && typeof value !== 'number' && !Array.isArray(value)) {
	            throw {
	                code: _errorCodes2.default.invalidObjectProperty,
	                message: 'The object passed in can only contain a string, number, or an array of numbers/strings as values for it\'s properties'
	            };
	        }

	        if (Array.isArray(value)) {
	            value.forEach(function (val, j) {
	                if (typeof val !== 'string' && typeof val !== 'number') {
	                    throw {
	                        code: _errorCodes2.default.invalidArrayValue,
	                        message: 'The array (' + value + ') can only contain string or numbers. ' + val + ' is not a number or string.'
	                    };
	                }

	                var encodedValue = encodeURIComponent(val);

	                result += key + '[]=' + encodedValue;

	                if (j !== value.length - 1) {
	                    result += '&';
	                }
	            });
	        } else {
	            value = encodeURIComponent(value);
	            result += key + '=' + value;
	        }

	        if (i !== objKeys.length - 1) {
	            result += '&';
	        }
	    });

	    return result;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    invalidObjectParam: "INVALID_OBJECT",
	    invalidObjectProperty: "INVALID_OBJECT_PROPERTY",
	    invalidArrayValue: "INVALID_ARRAY_VALUE"
	};

/***/ }
/******/ ])
});
;