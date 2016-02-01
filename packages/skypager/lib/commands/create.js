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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jcmVhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0IsTUFBTSxHQUFOLE1BQU07QUFBZixTQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pDLFNBQU8sQ0FDSixPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FDL0IsV0FBVyxDQUFDLGtEQUFrRCxDQUFDLENBQy9ELE1BQU0sQ0FBQyxlQUFlLEVBQUUsZ0NBQWdDLENBQUMsQ0FDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxNQUFNOztBQUVyQixTQUFTLE1BQU0sQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3JELFNBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtDQUNyQyIsImZpbGUiOiJjcmVhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2NyZWF0ZSA8dHlwZT4gW25hbWVdJylcbiAgICAuZGVzY3JpcHRpb24oJ2NyZWF0ZSBjb21tb25seSB1c2VkIHNreXBhZ2VyIGhlbHBlcnMgYW5kIGFzc2V0cycpXG4gICAgLm9wdGlvbignLS10eXBlIDx0eXBlPicsICd3aGljaCB0eXBlIG9mIGhlbHBlciBvciBlbnRpdHknKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlXG5cbmZ1bmN0aW9uIGhhbmRsZSAodHlwZSwgbmFtZSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc29sZS5sb2coJ3RvZG8gaW1wbGVtZW50IGNyZWF0ZScpXG59XG4iXX0=