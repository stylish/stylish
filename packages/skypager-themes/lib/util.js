'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.extractLessVars = extractLessVars;

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractLessVars(fromFile) {
  var includeComments = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var content = (0, _fs.readFileSync)(fromFile).toString();

  var lines = content.split('\n').filter(function (line) {
    return ('' + line).trim().match(/\@\w+\:/);
  });

  return lines.reduce(function (variables, line) {
    var _line$split = line.split(':');

    var _line$split2 = (0, _slicedToArray3.default)(_line$split, 2);

    var variable = _line$split2[0];
    var data = _line$split2[1];

    var _$split = ('' + data).split(/\;/);

    var _$split2 = (0, _slicedToArray3.default)(_$split, 2);

    var value = _$split2[0];
    var comment = _$split2[1];

    variables[variable] = { value: value, comment: comment };

    return variables;
  }, {});
}