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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbXBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUdnQixRQUFRLEdBQVIsUUFBUTtRQVNSLE1BQU0sR0FBTixNQUFNOzs7Ozs7Ozs7O0FBVGYsU0FBUyxRQUFRLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMzQyxTQUFPLENBQ0osT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQ3ZDLFdBQVcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUMvQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDNUI7O2tCQUVjLFFBQVE7QUFFaEIsU0FBUyxNQUFNLENBQUUsUUFBUSxFQUFFLEtBQUssRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFO01BQ3pELE9BQU8sR0FBSyxPQUFPLENBQW5CLE9BQU87O0FBQ2YsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRWxELE1BQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixTQUFLLHdDQUF1QyxRQUFRLENBQUksQ0FBQTtHQUN6RDtDQUNGOztBQUVELFNBQVMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNyQixTQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN4QixTQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2pCIiwiZmlsZSI6ImltcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAneWFyZ3MnXG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRlciAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdpbXBvcnQgPGltcG9ydGVyPiBbZmlsZXMuLi5dJylcbiAgICAuZGVzY3JpcHRpb24oJ3J1biBvbmUgb2YgdGhlIHByb2plY3QgaW1wb3J0ZXJzJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGltcG9ydGVyXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKGFjdGlvbklkLCBmaWxlcywgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc3QgeyBwcm9qZWN0IH0gPSBjb250ZXh0XG4gIGNvbnN0IGltcG9ydGVyID0gcHJvamVjdC5pbXBvcnRlcihhY3Rpb25JZCwgZmFsc2UpXG5cbiAgaWYgKCFpbXBvcnRlcikge1xuICAgIGFib3J0KGBjb3VsZCBub3QgZmluZCBhbmQgaW1wb3J0ZXIgbmFtZWQgJHsgYWN0aW9uSWQgfWApXG4gIH1cbn1cblxuZnVuY3Rpb24gYWJvcnQobWVzc2FnZSkge1xuICAgY29uc29sZS5sb2cobWVzc2FnZS5yZWQpXG4gICBwcm9jZXNzLmV4aXQoMClcbn1cbiJdfQ==