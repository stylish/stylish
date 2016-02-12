'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.repl = repl;
exports.handle = handle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function repl(program, dispatch) {
  program.command('console').description('Run an interactive REPL within the project').option('--es6', 'require babel-register and polyfill').action(dispatch(handle));
}

exports.default = repl;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var replServer = require('repl').start({
    prompt: 'skypager'.magenta + ':'.cyan + ' '
  });

  (0, _keys2.default)(context).forEach(function (key) {
    replServer.context[key] = context[key];
    replServer.context.keys = (0, _keys2.default)(context);
  });
}