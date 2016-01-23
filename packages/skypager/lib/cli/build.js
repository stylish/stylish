'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.handle = handle;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function build(program, dispatch) {
  program.command('build [entry]').description('build a website for this project using our preconfigured webpack bundle').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--external-vendors', "assume vendor libraries will be available to our script").option('--no-vendor-libraries', "don't include any vendor libraries in the bundle").option('--theme <name>', 'the name of the theme to use', 'dashboard').option('--output-folder <path>', 'relative path to the output folder', 'public').option('--html-filename <filename>', 'what should we name the html file?', 'index.html').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--push-state', 'use a 200.html file to support push state').option('--content-hash', 'fingerprint the names of the files as a cache busting mechanism', true).action(dispatch(handle));
}

exports.default = build;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  entry = entry || options.entry;
  var binPath = (0, _path.join)(pathToDevpack(), 'bin', 'cli.js');
  var cmd = binPath + ' build ' + process.argv.slice(3).join(' ');
  _shelljs2.default.exec(cmd);
}

function pathToDevpack() {
  return (0, _path.dirname)(require.resolve('skypager-devpack'));
}

function isDepackInstalled() {
  try {
    return pathToDevpack();
  } catch (error) {
    return false;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFLZ0IsS0FBSyxHQUFMLEtBQUs7UUFxQkwsTUFBTSxHQUFOLE1BQU07Ozs7Ozs7Ozs7Ozs7O0FBckJmLFNBQVMsS0FBSyxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDeEMsU0FBTyxDQUNKLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FDeEIsV0FBVyxDQUFDLHlFQUF5RSxDQUFDLENBQ3RGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FDckUsTUFBTSxDQUFDLHFCQUFxQixFQUFFLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUMzRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUscURBQXFELEVBQUUsS0FBSyxDQUFDLENBQ3pGLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSx5REFBeUQsQ0FBQyxDQUN2RixNQUFNLENBQUMsdUJBQXVCLEVBQUUsa0RBQWtELENBQUMsQ0FDbkYsTUFBTSxDQUFDLGdCQUFnQixFQUFFLDhCQUE4QixFQUFFLFdBQVcsQ0FBQyxDQUNyRSxNQUFNLENBQUMsd0JBQXdCLEVBQUUsb0NBQW9DLEVBQUUsUUFBUSxDQUFDLENBQ2hGLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxvQ0FBb0MsRUFBRSxZQUFZLENBQUMsQ0FDeEYsTUFBTSxDQUFDLDZCQUE2QixFQUFFLGtDQUFrQyxDQUFDLENBQ3pFLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSx5RUFBeUUsQ0FBQyxDQUN6RyxNQUFNLENBQUMsY0FBYyxFQUFFLDJDQUEyQyxDQUFDLENBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxpRUFBaUUsRUFBRSxJQUFJLENBQUMsQ0FDakcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxLQUFLO0FBRWIsU0FBUyxNQUFNLENBQUMsS0FBSyxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RELE9BQUssR0FBRyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQTtBQUM5QixNQUFJLE9BQU8sR0FBRyxVQTVCUCxJQUFJLEVBNEJRLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNwRCxNQUFJLEdBQUcsR0FBTyxPQUFPLGVBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFHLENBQUE7QUFDbkUsb0JBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0NBQ2hCOztBQUVELFNBQVMsYUFBYSxHQUFJO0FBQ3hCLFNBQU8sVUFsQ00sT0FBTyxFQW1DbEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUNwQyxDQUFBO0NBQ0Y7O0FBRUQsU0FBUyxpQkFBaUIsR0FBSTtBQUM1QixNQUFJO0FBQ0YsV0FBTyxhQUFhLEVBQUUsQ0FBQTtHQUN2QixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsV0FBTyxLQUFLLENBQUE7R0FDYjtDQUNGIiwiZmlsZSI6ImJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgam9pbiwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbGpzJ1xuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2J1aWxkIFtlbnRyeV0nKVxuICAgIC5kZXNjcmlwdGlvbignYnVpbGQgYSB3ZWJzaXRlIGZvciB0aGlzIHByb2plY3QgdXNpbmcgb3VyIHByZWNvbmZpZ3VyZWQgd2VicGFjayBidW5kbGUnKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1wbGF0Zm9ybSA8bmFtZT4nLCAnd2hpY2ggcGxhdGZvcm0gYXJlIHdlIGJ1aWxkaW5nIGZvcj8gZWxlY3Ryb24gb3Igd2ViJywgJ3dlYicpXG4gICAgLm9wdGlvbignLS1leHRlcm5hbC12ZW5kb3JzJywgXCJhc3N1bWUgdmVuZG9yIGxpYnJhcmllcyB3aWxsIGJlIGF2YWlsYWJsZSB0byBvdXIgc2NyaXB0XCIpXG4gICAgLm9wdGlvbignLS1uby12ZW5kb3ItbGlicmFyaWVzJywgXCJkb24ndCBpbmNsdWRlIGFueSB2ZW5kb3IgbGlicmFyaWVzIGluIHRoZSBidW5kbGVcIilcbiAgICAub3B0aW9uKCctLXRoZW1lIDxuYW1lPicsICd0aGUgbmFtZSBvZiB0aGUgdGhlbWUgdG8gdXNlJywgJ2Rhc2hib2FyZCcpXG4gICAgLm9wdGlvbignLS1vdXRwdXQtZm9sZGVyIDxwYXRoPicsICdyZWxhdGl2ZSBwYXRoIHRvIHRoZSBvdXRwdXQgZm9sZGVyJywgJ3B1YmxpYycpXG4gICAgLm9wdGlvbignLS1odG1sLWZpbGVuYW1lIDxmaWxlbmFtZT4nLCAnd2hhdCBzaG91bGQgd2UgbmFtZSB0aGUgaHRtbCBmaWxlPycsICdpbmRleC5odG1sJylcbiAgICAub3B0aW9uKCctLWh0bWwtdGVtcGxhdGUtcGF0aCA8cGF0aD4nLCAncGF0aCB0byB0aGUgaHRtbCB0ZW1wbGF0ZSB0byB1c2UnKVxuICAgIC5vcHRpb24oJy0tcHJlY29tcGlsZWQgPG5hbWU+JywgJ3VzZSBhIHByZWNvbXBpbGVkIGh0bWwgdGVtcGxhdGUgd2hpY2ggaW5jbHVkZXMgdmVuZG9yIGxpYnMsIHRoZW1lcywgZXRjJylcbiAgICAub3B0aW9uKCctLXB1c2gtc3RhdGUnLCAndXNlIGEgMjAwLmh0bWwgZmlsZSB0byBzdXBwb3J0IHB1c2ggc3RhdGUnKVxuICAgIC5vcHRpb24oJy0tY29udGVudC1oYXNoJywgJ2ZpbmdlcnByaW50IHRoZSBuYW1lcyBvZiB0aGUgZmlsZXMgYXMgYSBjYWNoZSBidXN0aW5nIG1lY2hhbmlzbScsIHRydWUpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBlbnRyeSA9IGVudHJ5IHx8IG9wdGlvbnMuZW50cnlcbiAgbGV0IGJpblBhdGggPSBqb2luKHBhdGhUb0RldnBhY2soKSwgJ2JpbicsICdjbGkuanMnKVxuICBsZXQgY21kID0gYCR7IGJpblBhdGggfSBidWlsZCAkeyBwcm9jZXNzLmFyZ3Yuc2xpY2UoMykuam9pbignICcpIH1gXG4gIHNoZWxsLmV4ZWMoY21kKVxufVxuXG5mdW5jdGlvbiBwYXRoVG9EZXZwYWNrICgpIHtcbiAgcmV0dXJuIGRpcm5hbWUoXG4gICAgcmVxdWlyZS5yZXNvbHZlKCdza3lwYWdlci1kZXZwYWNrJylcbiAgKVxufVxuXG5mdW5jdGlvbiBpc0RlcGFja0luc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhdGhUb0RldnBhY2soKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=