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
  program.command('run <action> [files...]').description('Run a project action').option('--debug', 'debug the action output').action(dispatch(handle));
}

exports.default = run;
function handle(actionId) {
  var files = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  var project = context.project;

  var action = project.actions.lookup(actionId, false);

  if (!action) {
    abort('could not find and action named ' + actionId);
  }

  options.pathArgs = files;

  console.log(('Running ' + action.name).green);

  var result = undefined;

  try {
    result = project.run.action(actionId, _yargs.argv);

    if (options.debug) {
      console.log(result);
    }
  } catch (error) {
    abort(error.message);
  }
}

function abort(message) {
  console.log(message.red);
  process.exit(0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9ydW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHZ0IsR0FBRyxHQUFILEdBQUc7UUFVSCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7OztBQVZmLFNBQVMsR0FBRyxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDdEMsU0FBTyxDQUNKLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUNsQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FDbkMsTUFBTSxDQUFDLFNBQVMsRUFBRSx5QkFBeUIsQ0FBQyxDQUM1QyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDNUI7O2tCQUVjLEdBQUc7QUFFWCxTQUFTLE1BQU0sQ0FBRSxRQUFRLEVBQTBDO01BQXhDLEtBQUsseURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTtNQUM5RCxPQUFPLEdBQUssT0FBTyxDQUFuQixPQUFPOztBQUNmLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTs7QUFFdEQsTUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFNBQUssc0NBQXFDLFFBQVEsQ0FBSSxDQUFBO0dBQ3ZEOztBQUVELFNBQU8sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBOztBQUV4QixTQUFPLENBQUMsR0FBRyxDQUFDLGNBQVksTUFBTSxDQUFDLElBQUksRUFBSSxLQUFLLENBQUMsQ0FBQTs7QUFFN0MsTUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVixNQUFJO0FBQ0YsVUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsU0EzQi9CLElBQUksQ0EyQmtDLENBQUE7O0FBRTNDLFFBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNoQixhQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3JCO0dBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFNBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckI7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDckIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDeEIsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUNqQiIsImZpbGUiOiJydW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycydcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICd5YXJncydcblxuZXhwb3J0IGZ1bmN0aW9uIHJ1biAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdydW4gPGFjdGlvbj4gW2ZpbGVzLi4uXScpXG4gICAgLmRlc2NyaXB0aW9uKCdSdW4gYSBwcm9qZWN0IGFjdGlvbicpXG4gICAgLm9wdGlvbignLS1kZWJ1ZycsICdkZWJ1ZyB0aGUgYWN0aW9uIG91dHB1dCcpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSAoYWN0aW9uSWQsIGZpbGVzID0gW10sIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnN0IHsgcHJvamVjdCB9ID0gY29udGV4dFxuICBjb25zdCBhY3Rpb24gPSBwcm9qZWN0LmFjdGlvbnMubG9va3VwKGFjdGlvbklkLCBmYWxzZSlcblxuICBpZiAoIWFjdGlvbikge1xuICAgIGFib3J0KGBjb3VsZCBub3QgZmluZCBhbmQgYWN0aW9uIG5hbWVkICR7IGFjdGlvbklkIH1gKVxuICB9XG5cbiAgb3B0aW9ucy5wYXRoQXJncyA9IGZpbGVzXG5cbiAgY29uc29sZS5sb2coYFJ1bm5pbmcgJHsgYWN0aW9uLm5hbWUgfWAuZ3JlZW4pXG5cbiAgbGV0IHJlc3VsdFxuXG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gcHJvamVjdC5ydW4uYWN0aW9uKGFjdGlvbklkLCBhcmd2KVxuXG4gICAgaWYgKG9wdGlvbnMuZGVidWcpIHtcbiAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGFib3J0KGVycm9yLm1lc3NhZ2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWJvcnQobWVzc2FnZSkge1xuICAgY29uc29sZS5sb2cobWVzc2FnZS5yZWQpXG4gICBwcm9jZXNzLmV4aXQoMClcbn1cbiJdfQ==