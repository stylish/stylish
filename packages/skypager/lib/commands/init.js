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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLElBQUksR0FBSixJQUFJO1FBUUosTUFBTSxHQUFOLE1BQU07QUFSZixTQUFTLElBQUksQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3ZDLFNBQU8sQ0FDSixPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FDN0IsV0FBVyxDQUFDLCtCQUErQixDQUFDLENBQzVDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSwwQ0FBMEMsRUFBRSxJQUFJLENBQUMsQ0FDNUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztBQUVNLFNBQVMsTUFBTSxDQUFFLFdBQVcsRUFBZ0I7TUFBZCxPQUFPLHlEQUFHLEVBQUU7Q0FFaEQ7O2tCQUVjLElBQUk7O0FBRW5CLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNqQixTQUFPLE1BQUksR0FBRyxFQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO1dBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUMsRUFBRSxDQUFDO0dBQUEsQ0FBQyxDQUFBO0NBQ25GIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaW5pdCAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdpbml0IDxwcm9qZWN0TmFtZT4nKVxuICAgIC5kZXNjcmlwdGlvbignY3JlYXRlIGEgbmV3IHNreXBhZ2VyIHByb2plY3QnKVxuICAgIC5vcHRpb24oJy0tcGx1Z2lucyA8bGlzdD4nLCAnYSBjb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBwbHVnaW5zIHRvIHVzZScsIGxpc3QpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlIChwcm9qZWN0TmFtZSwgb3B0aW9ucyA9IHt9KSB7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdFxuXG5mdW5jdGlvbiBsaXN0KHZhbCkge1xuICByZXR1cm4gYCR7IHZhbCB9YC5zcGxpdCgnLCcpLm1hcCh2YWwgPT4gdmFsLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXlxccyt8XFxzKyQvLCcnKSlcbn1cbiJdfQ==