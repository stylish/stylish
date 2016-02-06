'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.handle = handle;
function init(program, dispatch) {
  program.command('init <projectName>').description('create a new skypager project').option('--plugins <list>', 'a comma separated list of plugins to use', list).action(dispatch(handle));
}

function handle(projectName) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
}

exports.default = init;

function list(val) {
  return ('' + val).split(',').map(function (val) {
    return val.toLowerCase().replace(/^\s+|\s+$/, '');
  });
}