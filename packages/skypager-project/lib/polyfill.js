'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _util = require('./util');

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _flatten = require('lodash/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_assign2.default) {
  Object.assign = _objectAssign2.default;
}

if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Array.prototype.flatten) {
  Array.prototype.flatten = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _flatten2.default.apply(undefined, [this].concat(args));
  };
}

if (!Array.prototype.compact) {
  Array.prototype.compact = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _compact2.default.apply(undefined, [this].concat(args));
  };
}

Array.prototype.pluckAll = function () {
  for (var _len3 = arguments.length, props = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    props[_key3] = arguments[_key3];
  }

  return this.map(function (o) {
    return props.reduce(function (m, p) {
      m[p] = o[p];
      return m;
    }, {});
  });
};

Array.prototype.pluck = function (prop) {
  return this.map(function (i) {
    return i[prop];
  });
};

Array.prototype.unique = function () {
  var u = {};
  for (var i = 0, l = this.length; i < l; ++i) {
    if (u.hasOwnProperty(this[i])) {
      continue;
    }
    u[this[i]] = 1;
  }
  return (0, _keys2.default)(u);
};

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

module.exports = {};