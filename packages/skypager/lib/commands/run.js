'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.handle = handle;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _yargs = require('yargs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(program, dispatch) {
  program.command('run <action> [files...]').action(dispatch(handle));
}

exports.default = run;
function handle(actionId, files) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  var project = context.project;

  var action = project.actions.lookup(actionId, false);

  if (!action) {
    abort('could not find and action named ' + actionId);
  }
}

function abort(message) {
  console.log(message.red);
  process.exit(0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9ydW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHZ0IsR0FBRyxHQUFILEdBQUc7UUFRSCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7OztBQVJmLFNBQVMsR0FBRyxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDdEMsU0FBTyxDQUNKLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDNUI7O2tCQUVjLEdBQUc7QUFFWCxTQUFTLE1BQU0sQ0FBRSxRQUFRLEVBQUUsS0FBSyxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7TUFDekQsT0FBTyxHQUFLLE9BQU8sQ0FBbkIsT0FBTzs7QUFDZixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRXRELE1BQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxTQUFLLHNDQUFxQyxRQUFRLENBQUksQ0FBQTtHQUN2RDtDQUNGOztBQUVELFNBQVMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNyQixTQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN4QixTQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2pCIiwiZmlsZSI6InJ1bi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJ1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3lhcmdzJ1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ3J1biA8YWN0aW9uPiBbZmlsZXMuLi5dJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1blxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlIChhY3Rpb25JZCwgZmlsZXMsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnN0IHsgcHJvamVjdCB9ID0gY29udGV4dFxuICBjb25zdCBhY3Rpb24gPSBwcm9qZWN0LmFjdGlvbnMubG9va3VwKGFjdGlvbklkLCBmYWxzZSlcblxuICBpZiAoIWFjdGlvbikge1xuICAgIGFib3J0KGBjb3VsZCBub3QgZmluZCBhbmQgYWN0aW9uIG5hbWVkICR7IGFjdGlvbklkIH1gKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFib3J0KG1lc3NhZ2UpIHtcbiAgIGNvbnNvbGUubG9nKG1lc3NhZ2UucmVkKVxuICAgcHJvY2Vzcy5leGl0KDApXG59XG4iXX0=