'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
function create(program, dispatch) {
  program.command('create <type> [name]').option('--type <type>', 'which type of helper or entity').action(dispatch(handle));
}

exports.default = create;

function handle(type, name) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  console.log('todo implement create');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY3JlYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLE1BQU0sR0FBTixNQUFNO0FBQWYsU0FBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QyxTQUFPLENBQ0osT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQy9CLE1BQU0sQ0FBQyxlQUFlLEVBQUUsZ0NBQWdDLENBQUMsQ0FDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxNQUFNOztBQUVyQixTQUFTLE1BQU0sQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3JELFNBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtDQUNyQyIsImZpbGUiOiJjcmVhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2NyZWF0ZSA8dHlwZT4gW25hbWVdJylcbiAgICAub3B0aW9uKCctLXR5cGUgPHR5cGU+JywgJ3doaWNoIHR5cGUgb2YgaGVscGVyIG9yIGVudGl0eScpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVcblxuZnVuY3Rpb24gaGFuZGxlICh0eXBlLCBuYW1lLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zb2xlLmxvZygndG9kbyBpbXBsZW1lbnQgY3JlYXRlJylcbn1cbiJdfQ==