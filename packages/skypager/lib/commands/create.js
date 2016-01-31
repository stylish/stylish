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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jcmVhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0IsTUFBTSxHQUFOLE1BQU07QUFBZixTQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pDLFNBQU8sQ0FDSixPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FDL0IsTUFBTSxDQUFDLGVBQWUsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUN6RCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDNUI7O2tCQUVjLE1BQU07O0FBRXJCLFNBQVMsTUFBTSxDQUFFLElBQUksRUFBRSxJQUFJLEVBQThCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDckQsU0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0NBQ3JDIiwiZmlsZSI6ImNyZWF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGUgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnY3JlYXRlIDx0eXBlPiBbbmFtZV0nKVxuICAgIC5vcHRpb24oJy0tdHlwZSA8dHlwZT4nLCAnd2hpY2ggdHlwZSBvZiBoZWxwZXIgb3IgZW50aXR5JylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVxuXG5mdW5jdGlvbiBoYW5kbGUgKHR5cGUsIG5hbWUsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnNvbGUubG9nKCd0b2RvIGltcGxlbWVudCBjcmVhdGUnKVxufVxuIl19