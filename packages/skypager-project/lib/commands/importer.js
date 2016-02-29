'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importer = importer;
exports.handle = handle;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _yargs = require('yargs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function importer(program, dispatch) {
  program.command('import <importer> [files...]').description('run one of the project importers').action(dispatch(handle));
}

exports.default = importer;
function handle(actionId, files) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  var project = context.project;

  var importer = project.importer(actionId, false);

  if (!importer) {
    abort('could not find and importer named ' + actionId);
  }
}

function abort(message) {
  console.log(message.red);
  process.exit(0);
}