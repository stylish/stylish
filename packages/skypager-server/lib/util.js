'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.define = define;
exports.shell = shell;
exports.colorize = colorize;

var _child_process = require('child_process');

var _fs = require('fs');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function define(object, property, value) {
  var enumerable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
  var configurable = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

  (0, _defineProperty2.default)(object, property, {
    value: value,
    enumerable: enumerable,
    configurable: configurable
  });
}

function shell(command) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var handle = arguments[2];

  if (!handle && !(0, _lodash.isFunction)(options) && (0, _lodash.isEmpty)(options)) {} else if (!handle && (0, _lodash.isFunction)(options)) {
    handle = options;
    options = {};
  }

  var _command$split = command.split(' ');

  var _command$split2 = (0, _toArray3.default)(_command$split);

  var cmd = _command$split2[0];

  var args = _command$split2.slice(1);

  var debug = (0, _fs.createWriteStream)(process.env.PWD + '/log/debug.log');

  if (options.cwd) {
    options.env = (0, _assign2.default)({}, process.env, {
      PWD: options.cwd
    });
  }

  var proc = (0, _child_process.spawn)(cmd, args, options);

  if (handle) {
    proc.stdout && proc.stdout.on('data', function (data) {
      return handle(data.toString());
    });
    proc.stderr && proc.stderr.on('data', function (data) {
      return handle(data.toString());
    });
    proc.on('error', function (data) {
      return handle(data.toString());
    });
  }

  proc.on('error', function () {
    debug.write(colorize.apply(undefined, arguments));
  });

  return proc;
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