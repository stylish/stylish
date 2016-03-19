'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.available = available;
exports.handle = handle;

var _util = require('../util');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function available(program, dispatch) {
  program.command('info').description('list available helpers in this project').action(dispatch(handle));
}

exports.default = available;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var project = context.project;

  console.log('Support Libraries'.magenta);
  console.log('================='.white);

  supportLibraries.forEach(function (mod) {
    try {
      require(mod);
      console.log(mod.cyan);
      console.log('    found in: ' + require.resolve(mod));
      console.log('');
    } catch (error) {
      console.log(mod + ': ' + 'Missing.'.red);
    }
  });

  console.log('');
  console.log('Available Helpers'.green);
  console.log('================='.white);
  console.log('');

  var regs = (0, _keys2.default)(project.registries);

  regs.forEach(function (regName) {
    console.log(((0, _lodash.capitalize)(regName) + ':').cyan);
    console.log('-----');
    var registry = project.registries[regName];

    registry.available.sort().forEach(function (val) {
      console.log('    ' + val);
    });

    console.log('');
  });
}

var supportLibraries = ['skypager-project', 'skypager-devpack', 'skypager-themes', 'skypager-server'];