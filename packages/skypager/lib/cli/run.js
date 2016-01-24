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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBR2dCLEdBQUcsR0FBSCxHQUFHO1FBUUgsTUFBTSxHQUFOLE1BQU07Ozs7Ozs7Ozs7QUFSZixTQUFTLEdBQUcsQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLFNBQU8sQ0FDSixPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxHQUFHO0FBRVgsU0FBUyxNQUFNLENBQUUsUUFBUSxFQUFFLEtBQUssRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFO01BQ3pELE9BQU8sR0FBSyxPQUFPLENBQW5CLE9BQU87O0FBQ2YsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUV0RCxNQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsU0FBSyxzQ0FBcUMsUUFBUSxDQUFJLENBQUE7R0FDdkQ7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDckIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDeEIsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUNqQiIsImZpbGUiOiJydW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycydcbmltcG9ydCB7IGFyZ3YgfSBmcm9tICd5YXJncydcblxuZXhwb3J0IGZ1bmN0aW9uIHJ1biAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdydW4gPGFjdGlvbj4gW2ZpbGVzLi4uXScpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSAoYWN0aW9uSWQsIGZpbGVzLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zdCB7IHByb2plY3QgfSA9IGNvbnRleHRcbiAgY29uc3QgYWN0aW9uID0gcHJvamVjdC5hY3Rpb25zLmxvb2t1cChhY3Rpb25JZCwgZmFsc2UpXG5cbiAgaWYgKCFhY3Rpb24pIHtcbiAgICBhYm9ydChgY291bGQgbm90IGZpbmQgYW5kIGFjdGlvbiBuYW1lZCAkeyBhY3Rpb25JZCB9YClcbiAgfVxufVxuXG5mdW5jdGlvbiBhYm9ydChtZXNzYWdlKSB7XG4gICBjb25zb2xlLmxvZyhtZXNzYWdlLnJlZClcbiAgIHByb2Nlc3MuZXhpdCgwKVxufVxuIl19