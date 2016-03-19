'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.hideProperties = hideProperties;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var defineProperty = _Object.defineProperty;
function hideProperties(obj) {
  var props = arguments.length - 1 === 2 ? (0, _defineProperty3.default)({}, arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]) : arguments.length <= 1 ? undefined : arguments[1];

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