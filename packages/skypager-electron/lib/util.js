'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideProperties = hideProperties;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function hideProperties(obj) {
  var props = arguments.length - 1 === 2 ? _defineProperty({}, arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]) : arguments.length <= 1 ? undefined : arguments[1];

  keys(props).forEach(function (prop) {
    var value = props[prop];

    defineProperty(obj, prop, {
      enumerable: false,
      get: function get() {
        return typeof value === 'function' ? value.call(obj) : value;
      }
    });
  });
}