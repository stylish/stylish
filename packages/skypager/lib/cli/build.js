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
  var cmd = 'skypager-devpack build ' + process.argv.slice(3).join(' ');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFLZ0IsS0FBSyxHQUFMLEtBQUs7UUFxQkwsTUFBTSxHQUFOLE1BQU07Ozs7Ozs7Ozs7Ozs7O0FBckJmLFNBQVMsS0FBSyxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDeEMsU0FBTyxDQUNKLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FDeEIsV0FBVyxDQUFDLHlFQUF5RSxDQUFDLENBQ3RGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FDckUsTUFBTSxDQUFDLHFCQUFxQixFQUFFLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUMzRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUscURBQXFELEVBQUUsS0FBSyxDQUFDLENBQ3pGLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSx5REFBeUQsQ0FBQyxDQUN2RixNQUFNLENBQUMsdUJBQXVCLEVBQUUsa0RBQWtELENBQUMsQ0FDbkYsTUFBTSxDQUFDLGdCQUFnQixFQUFFLDhCQUE4QixFQUFFLFdBQVcsQ0FBQyxDQUNyRSxNQUFNLENBQUMsd0JBQXdCLEVBQUUsb0NBQW9DLEVBQUUsUUFBUSxDQUFDLENBQ2hGLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxvQ0FBb0MsRUFBRSxZQUFZLENBQUMsQ0FDeEYsTUFBTSxDQUFDLDZCQUE2QixFQUFFLGtDQUFrQyxDQUFDLENBQ3pFLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSx5RUFBeUUsQ0FBQyxDQUN6RyxNQUFNLENBQUMsY0FBYyxFQUFFLDJDQUEyQyxDQUFDLENBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxpRUFBaUUsRUFBRSxJQUFJLENBQUMsQ0FDakcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxLQUFLO0FBRWIsU0FBUyxNQUFNLENBQUMsS0FBSyxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RELE9BQUssR0FBRyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQTtBQUM5QixNQUFJLEdBQUcsK0JBQThCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRyxDQUFBO0FBQ3ZFLG9CQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtDQUNoQjs7QUFFRCxTQUFTLGFBQWEsR0FBSTtBQUN4QixTQUFPLFVBakNNLE9BQU8sRUFrQ2xCLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FDcEMsQ0FBQTtDQUNGOztBQUVELFNBQVMsaUJBQWlCLEdBQUk7QUFDNUIsTUFBSTtBQUNGLFdBQU8sYUFBYSxFQUFFLENBQUE7R0FDdkIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFdBQU8sS0FBSyxDQUFBO0dBQ2I7Q0FDRiIsImZpbGUiOiJidWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdidWlsZCBbZW50cnldJylcbiAgICAuZGVzY3JpcHRpb24oJ2J1aWxkIGEgd2Vic2l0ZSBmb3IgdGhpcyBwcm9qZWN0IHVzaW5nIG91ciBwcmVjb25maWd1cmVkIHdlYnBhY2sgYnVuZGxlJylcbiAgICAub3B0aW9uKCctLWVudHJ5IDxwYXRoPicsICdyZWxhdGl2ZSBwYXRoIHRvIHRoZSBlbnRyeSBwb2ludCcsICcuL3NyYycpXG4gICAgLm9wdGlvbignLS1lbnRyeS1uYW1lIDxuYW1lPicsICd3aGF0IHRvIG5hbWUgdGhlIGVudHJ5IHBvaW50IHNjcmlwdCcsICdhcHAnKVxuICAgIC5vcHRpb24oJy0tcGxhdGZvcm0gPG5hbWU+JywgJ3doaWNoIHBsYXRmb3JtIGFyZSB3ZSBidWlsZGluZyBmb3I/IGVsZWN0cm9uIG9yIHdlYicsICd3ZWInKVxuICAgIC5vcHRpb24oJy0tZXh0ZXJuYWwtdmVuZG9ycycsIFwiYXNzdW1lIHZlbmRvciBsaWJyYXJpZXMgd2lsbCBiZSBhdmFpbGFibGUgdG8gb3VyIHNjcmlwdFwiKVxuICAgIC5vcHRpb24oJy0tbm8tdmVuZG9yLWxpYnJhcmllcycsIFwiZG9uJ3QgaW5jbHVkZSBhbnkgdmVuZG9yIGxpYnJhcmllcyBpbiB0aGUgYnVuZGxlXCIpXG4gICAgLm9wdGlvbignLS10aGVtZSA8bmFtZT4nLCAndGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZScsICdkYXNoYm9hcmQnKVxuICAgIC5vcHRpb24oJy0tb3V0cHV0LWZvbGRlciA8cGF0aD4nLCAncmVsYXRpdmUgcGF0aCB0byB0aGUgb3V0cHV0IGZvbGRlcicsICdwdWJsaWMnKVxuICAgIC5vcHRpb24oJy0taHRtbC1maWxlbmFtZSA8ZmlsZW5hbWU+JywgJ3doYXQgc2hvdWxkIHdlIG5hbWUgdGhlIGh0bWwgZmlsZT8nLCAnaW5kZXguaHRtbCcpXG4gICAgLm9wdGlvbignLS1odG1sLXRlbXBsYXRlLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIGh0bWwgdGVtcGxhdGUgdG8gdXNlJylcbiAgICAub3B0aW9uKCctLXByZWNvbXBpbGVkIDxuYW1lPicsICd1c2UgYSBwcmVjb21waWxlZCBodG1sIHRlbXBsYXRlIHdoaWNoIGluY2x1ZGVzIHZlbmRvciBsaWJzLCB0aGVtZXMsIGV0YycpXG4gICAgLm9wdGlvbignLS1wdXNoLXN0YXRlJywgJ3VzZSBhIDIwMC5odG1sIGZpbGUgdG8gc3VwcG9ydCBwdXNoIHN0YXRlJylcbiAgICAub3B0aW9uKCctLWNvbnRlbnQtaGFzaCcsICdmaW5nZXJwcmludCB0aGUgbmFtZXMgb2YgdGhlIGZpbGVzIGFzIGEgY2FjaGUgYnVzdGluZyBtZWNoYW5pc20nLCB0cnVlKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZShlbnRyeSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgZW50cnkgPSBlbnRyeSB8fCBvcHRpb25zLmVudHJ5XG4gIGxldCBjbWQgPSBgc2t5cGFnZXItZGV2cGFjayBidWlsZCAkeyBwcm9jZXNzLmFyZ3Yuc2xpY2UoMykuam9pbignICcpIH1gXG4gIHNoZWxsLmV4ZWMoY21kKVxufVxuXG5mdW5jdGlvbiBwYXRoVG9EZXZwYWNrICgpIHtcbiAgcmV0dXJuIGRpcm5hbWUoXG4gICAgcmVxdWlyZS5yZXNvbHZlKCdza3lwYWdlci1kZXZwYWNrJylcbiAgKVxufVxuXG5mdW5jdGlvbiBpc0RlcGFja0luc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhdGhUb0RldnBhY2soKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=