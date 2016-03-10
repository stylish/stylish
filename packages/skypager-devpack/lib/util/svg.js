'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.svg = svg;

var _svgToReact = require('svg-to-react');

var _svgToReact2 = _interopRequireDefault(_svgToReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function svg(path) {
  return new _promise2.default(function (resolve, reject) {
    _svgToReact2.default.convertFile(path, function (err, fn) {
      if (err) {
        reject(err);
        return;
      }

      return resolve(fn);
    });
  });
}