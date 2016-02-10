"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

exports.values = values;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function values(object) {
  return (0, _keys2.default)(object).map(function (key) {
    return object[key];
  });
}