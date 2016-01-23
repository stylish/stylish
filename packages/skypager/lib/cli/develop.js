'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.develop = develop;
exports.handle = handle;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function develop(program, dispatch) {
  program.command('develop [entry]').description('run a development server for this project').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use', 'dashboard').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--expose', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server').option('--expose-config <path>', 'path to a configuration file for the expose service').action(dispatch(handle));
}

exports.default = develop;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var entryPoint = entry || options.entry;
  var binPath = (0, _path.join)(pathToDevpack(), 'bin', 'cli.js');
  var cmd = binPath + ' start ' + process.argv.slice(3).join(' ') + ' --entry ' + entryPoint;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvZGV2ZWxvcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUtnQixPQUFPLEdBQVAsT0FBTztRQWlCUCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7QUFqQmYsU0FBUyxPQUFPLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxTQUFPLENBQ0osT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQzFCLFdBQVcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUN4RCxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsa0NBQWtDLEVBQUUsT0FBTyxDQUFDLENBQ3JFLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FDM0UsTUFBTSxDQUFDLG1CQUFtQixFQUFFLHFEQUFxRCxFQUFFLEtBQUssQ0FBQyxDQUN6RixNQUFNLENBQUMsZ0JBQWdCLEVBQUUsOEJBQThCLEVBQUUsV0FBVyxDQUFDLENBQ3JFLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUN6RSxNQUFNLENBQUMsc0JBQXNCLEVBQUUseUVBQXlFLENBQUMsQ0FDekcsTUFBTSxDQUFDLFVBQVUsRUFBRSx5RkFBeUYsQ0FBQyxDQUM3RyxNQUFNLENBQUMsd0JBQXdCLEVBQUUscURBQXFELENBQUMsQ0FDdkYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxPQUFPO0FBRWYsU0FBUyxNQUFNLENBQUUsS0FBSyxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3ZELE1BQUksVUFBVSxHQUFHLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFBO0FBQ3ZDLE1BQUksT0FBTyxHQUFHLFVBeEJQLElBQUksRUF3QlEsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ3BELE1BQUksR0FBRyxHQUFPLE9BQU8sZUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFjLFVBQVUsQUFBRyxDQUFBOztBQUUzRixvQkFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7Q0FDaEI7O0FBRUQsU0FBUyxhQUFhLEdBQUk7QUFDeEIsU0FBTyxVQS9CTSxPQUFPLEVBZ0NsQixPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQ3BDLENBQUE7Q0FDRjs7QUFFRCxTQUFTLGlCQUFpQixHQUFJO0FBQzVCLE1BQUk7QUFDRixXQUFPLGFBQWEsRUFBRSxDQUFBO0dBQ3ZCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxXQUFPLEtBQUssQ0FBQTtHQUNiO0NBQ0YiLCJmaWxlIjoiZGV2ZWxvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZlbG9wIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2RldmVsb3AgW2VudHJ5XScpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gYSBkZXZlbG9wbWVudCBzZXJ2ZXIgZm9yIHRoaXMgcHJvamVjdCcpXG4gICAgLm9wdGlvbignLS1lbnRyeSA8cGF0aD4nLCAncmVsYXRpdmUgcGF0aCB0byB0aGUgZW50cnkgcG9pbnQnLCAnLi9zcmMnKVxuICAgIC5vcHRpb24oJy0tZW50cnktbmFtZSA8bmFtZT4nLCAnd2hhdCB0byBuYW1lIHRoZSBlbnRyeSBwb2ludCBzY3JpcHQnLCAnYXBwJylcbiAgICAub3B0aW9uKCctLXBsYXRmb3JtIDxuYW1lPicsICd3aGljaCBwbGF0Zm9ybSBhcmUgd2UgYnVpbGRpbmcgZm9yPyBlbGVjdHJvbiBvciB3ZWInLCAnd2ViJylcbiAgICAub3B0aW9uKCctLXRoZW1lIDxuYW1lPicsICd0aGUgbmFtZSBvZiB0aGUgdGhlbWUgdG8gdXNlJywgJ2Rhc2hib2FyZCcpXG4gICAgLm9wdGlvbignLS1odG1sLXRlbXBsYXRlLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIGh0bWwgdGVtcGxhdGUgdG8gdXNlJylcbiAgICAub3B0aW9uKCctLXByZWNvbXBpbGVkIDxuYW1lPicsICd1c2UgYSBwcmVjb21waWxlZCBodG1sIHRlbXBsYXRlIHdoaWNoIGluY2x1ZGVzIHZlbmRvciBsaWJzLCB0aGVtZXMsIGV0YycpXG4gICAgLm9wdGlvbignLS1leHBvc2UnLCAnd2hlbiBlbmFibGVkLCB3aWxsIGF0dGVtcHQgdG8gdXNlIG5ncm9rIHRvIGV4cG9zZSBhIHB1YmxpYyBBUEkgZW5kcG9pbnQgZm9yIHRoaXMgc2VydmVyJylcbiAgICAub3B0aW9uKCctLWV4cG9zZS1jb25maWcgPHBhdGg+JywgJ3BhdGggdG8gYSBjb25maWd1cmF0aW9uIGZpbGUgZm9yIHRoZSBleHBvc2Ugc2VydmljZScpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZXZlbG9wXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsZXQgZW50cnlQb2ludCA9IGVudHJ5IHx8IG9wdGlvbnMuZW50cnlcbiAgbGV0IGJpblBhdGggPSBqb2luKHBhdGhUb0RldnBhY2soKSwgJ2JpbicsICdjbGkuanMnKVxuICBsZXQgY21kID0gYCR7IGJpblBhdGggfSBzdGFydCAkeyBwcm9jZXNzLmFyZ3Yuc2xpY2UoMykuam9pbignICcpIH0gLS1lbnRyeSAkeyBlbnRyeVBvaW50IH1gXG5cbiAgc2hlbGwuZXhlYyhjbWQpXG59XG5cbmZ1bmN0aW9uIHBhdGhUb0RldnBhY2sgKCkge1xuICByZXR1cm4gZGlybmFtZShcbiAgICByZXF1aXJlLnJlc29sdmUoJ3NreXBhZ2VyLWRldnBhY2snKVxuICApXG59XG5cbmZ1bmN0aW9uIGlzRGVwYWNrSW5zdGFsbGVkICgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcGF0aFRvRGV2cGFjaygpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==