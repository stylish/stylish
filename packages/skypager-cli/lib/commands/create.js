'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
function create(program, dispatch) {
  program.command('create <type> [name]').description('create commonly used skypager helpers and assets').option('--type <type>', 'which type of helper or entity').action(dispatch(handle));
}

exports.default = create;

function handle(type, name) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  console.log('todo implement create');
}