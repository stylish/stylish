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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW1wb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHZ0IsUUFBUSxHQUFSLFFBQVE7UUFTUixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7OztBQVRmLFNBQVMsUUFBUSxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDM0MsU0FBTyxDQUNKLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUN2QyxXQUFXLENBQUMsa0NBQWtDLENBQUMsQ0FDL0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxRQUFRO0FBRWhCLFNBQVMsTUFBTSxDQUFFLFFBQVEsRUFBRSxLQUFLLEVBQThCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTtNQUN6RCxPQUFPLEdBQUssT0FBTyxDQUFuQixPQUFPOztBQUNmLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVsRCxNQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsU0FBSyx3Q0FBdUMsUUFBUSxDQUFJLENBQUE7R0FDekQ7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDckIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDeEIsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUNqQiIsImZpbGUiOiJpbXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJ1xuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3lhcmdzJ1xuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0ZXIgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnaW1wb3J0IDxpbXBvcnRlcj4gW2ZpbGVzLi4uXScpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gb25lIG9mIHRoZSBwcm9qZWN0IGltcG9ydGVycycpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbXBvcnRlclxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlIChhY3Rpb25JZCwgZmlsZXMsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnN0IHsgcHJvamVjdCB9ID0gY29udGV4dFxuICBjb25zdCBpbXBvcnRlciA9IHByb2plY3QuaW1wb3J0ZXIoYWN0aW9uSWQsIGZhbHNlKVxuXG4gIGlmICghaW1wb3J0ZXIpIHtcbiAgICBhYm9ydChgY291bGQgbm90IGZpbmQgYW5kIGltcG9ydGVyIG5hbWVkICR7IGFjdGlvbklkIH1gKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFib3J0KG1lc3NhZ2UpIHtcbiAgIGNvbnNvbGUubG9nKG1lc3NhZ2UucmVkKVxuICAgcHJvY2Vzcy5leGl0KDApXG59XG4iXX0=