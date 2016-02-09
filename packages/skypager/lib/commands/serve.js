'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serve = serve;
exports.handle = handle;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serve(program, dispatch) {
  program.command('serve').option('--port <port>', 'which port? specify any to use any available port', 3000).option('--host <hostname>', 'which hostname? defaults to localhost', 'localhost').option('--expose', 'when enabled, will expose this server to the public using ngrok').option('--expose-config <path>', 'path to a config file for the expose service').action(dispatch(handle));
}

exports.default = serve;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log('TODO handle serve CLI');
}