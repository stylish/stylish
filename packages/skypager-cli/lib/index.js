'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cli = cli;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _mkdirp = require('mkdirp');

var _util = require('./util');

var _commands = require('./commands');

var _dependencies = require('./dependencies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cli() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  (0, _dependencies.checkAll)();

  if (!(0, _util.findPackageSync)('skypager-project')) {
    (0, _commands.program)({ mode: 'missing_dependencies' })();
    return;
  }

  (0, _commands.program)(options)();
  return;
}

exports.default = cli;