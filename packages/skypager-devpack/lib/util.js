'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.defineProp = defineProp;
exports.colorize = colorize;

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defineProp(object, property, value) {
  var enumerable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
  var configurable = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

  (0, _defineProperty2.default)(object, property, {
    value: value,
    enumerable: enumerable,
    configurable: configurable
  });
}

function colorize(object) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var engine = require('./util/colorize');

  engine.setOptions((0, _lodash.defaultsDeep)(options, {
    colors: {
      num: 'cyan',
      str: 'magenta',
      bool: 'red',
      regex: 'blue',
      undef: 'grey',
      null: 'grey',
      attr: 'green',
      quot: 'yellow',
      punc: 'yellow',
      brack: 'yellow',
      func: 'grey'
    },
    display: {
      func: false,
      date: false,
      xarr: true
    },
    level: {
      show: false,
      char: '.',
      color: 'red',
      spaces: 2,
      start: 0
    },
    params: {
      async: false,
      colored: true
    }
  }));

  return engine.gen(object, options.level.start);
}