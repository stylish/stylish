'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.develop = develop;
exports.handle = handle;
exports.launchServer = launchServer;
exports.launchTunnel = launchTunnel;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function develop(program, dispatch) {
  program.command('develop [entry]').description('run a development server for this project').option('--port <port>', 'which port should this server listen on?', 3000).option('--host <hostname>', 'which hostname should this server listen on?', 'localhost').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--expose', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server').option('--expose-config <path>', 'path to a configuration file for the expose service').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').option('--dev-tools-path <path>', 'path to the skypager-devpack').action(dispatch(handle));
}

exports.default = develop;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  launchServer(entry, options, context);

  if (options.expose) {
    launchTunnel(options, context);
  }
}

function launchServer(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var project = context.project;

  options.entry = entry || options.entry || './src';
  options.theme = options.theme || project.options.theme || 'default';

  require(pathToDevpack(options.devToolsPath) + '/lib/server')(options);
}

function launchTunnel(options, context) {
  var server = _shelljs2.default.exec('ngrok http ' + options.port, { async: true });

  server.stdout.on('data', function (data) {
    if (!options.silent) {
      console.log(data);
    }
  });

  server.stderr.on('data', function (data) {
    if (options.debug) {
      console.log(data);
    }
  });
}

function pathToDevpack(opt) {
  return (0, _path.resolve)(opt) || process.env.SKYPAGER_DEVPACK_PATH || (0, _path.dirname)(require.resolve('skypager-devpack'));
}

function isDepackInstalled() {
  try {
    return pathToDevpack();
  } catch (error) {
    return false;
  }
}
//# sourceMappingURL=data:application/json;base64,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TUFBTSxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ2pDLFFBQUcsT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNoQixhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2xCO0dBQ0YsQ0FBQyxDQUFBO0NBQ0g7O0FBRUQsU0FBUyxhQUFhLENBQUUsR0FBRyxFQUFFO0FBQzNCLFNBQU8sVUE3RE0sT0FBTyxFQTZETCxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLFVBN0R0QyxPQUFPLEVBOEQzQixPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQ3BDLENBQUE7Q0FDRjs7QUFFRCxTQUFTLGlCQUFpQixHQUFJO0FBQzVCLE1BQUk7QUFDRixXQUFPLGFBQWEsRUFBRSxDQUFBO0dBQ3ZCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxXQUFPLEtBQUssQ0FBQTtHQUNiO0NBQ0YiLCJmaWxlIjoiZGV2ZWxvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZlbG9wIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2RldmVsb3AgW2VudHJ5XScpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gYSBkZXZlbG9wbWVudCBzZXJ2ZXIgZm9yIHRoaXMgcHJvamVjdCcpXG4gICAgLm9wdGlvbignLS1wb3J0IDxwb3J0PicsICd3aGljaCBwb3J0IHNob3VsZCB0aGlzIHNlcnZlciBsaXN0ZW4gb24/JywgMzAwMClcbiAgICAub3B0aW9uKCctLWhvc3QgPGhvc3RuYW1lPicsICd3aGljaCBob3N0bmFtZSBzaG91bGQgdGhpcyBzZXJ2ZXIgbGlzdGVuIG9uPycsICdsb2NhbGhvc3QnKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1wbGF0Zm9ybSA8bmFtZT4nLCAnd2hpY2ggcGxhdGZvcm0gYXJlIHdlIGJ1aWxkaW5nIGZvcj8gZWxlY3Ryb24gb3Igd2ViJywgJ3dlYicpXG4gICAgLm9wdGlvbignLS10aGVtZSA8bmFtZT4nLCAndGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZScpXG4gICAgLm9wdGlvbignLS1odG1sLXRlbXBsYXRlLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIGh0bWwgdGVtcGxhdGUgdG8gdXNlJylcbiAgICAub3B0aW9uKCctLXByZWNvbXBpbGVkIDxuYW1lPicsICd1c2UgYSBwcmVjb21waWxlZCBodG1sIHRlbXBsYXRlIHdoaWNoIGluY2x1ZGVzIHZlbmRvciBsaWJzLCB0aGVtZXMsIGV0YycpXG4gICAgLm9wdGlvbignLS1leHBvc2UnLCAnd2hlbiBlbmFibGVkLCB3aWxsIGF0dGVtcHQgdG8gdXNlIG5ncm9rIHRvIGV4cG9zZSBhIHB1YmxpYyBBUEkgZW5kcG9pbnQgZm9yIHRoaXMgc2VydmVyJylcbiAgICAub3B0aW9uKCctLWV4cG9zZS1jb25maWcgPHBhdGg+JywgJ3BhdGggdG8gYSBjb25maWd1cmF0aW9uIGZpbGUgZm9yIHRoZSBleHBvc2Ugc2VydmljZScpXG4gICAgLm9wdGlvbignLS1zaWxlbnQnLCAnc3VwcHJlc3MgYW55IHNlcnZlciBvdXRwdXQnKVxuICAgIC5vcHRpb24oJy0tZGVidWcnLCAnc2hvdyBlcnJvciBpbmZvIGZyb20gdGhlIHNlcnZlcicpXG4gICAgLm9wdGlvbignLS1kZXYtdG9vbHMtcGF0aCA8cGF0aD4nLCAncGF0aCB0byB0aGUgc2t5cGFnZXItZGV2cGFjaycpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZXZlbG9wXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsYXVuY2hTZXJ2ZXIoZW50cnksIG9wdGlvbnMsIGNvbnRleHQpXG5cbiAgaWYgKG9wdGlvbnMuZXhwb3NlKSB7XG4gICAgbGF1bmNoVHVubmVsKG9wdGlvbnMsIGNvbnRleHQpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhdW5jaFNlcnZlciAoZW50cnksIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0XG5cbiAgb3B0aW9ucy5lbnRyeSA9IGVudHJ5IHx8IG9wdGlvbnMuZW50cnkgfHwgJy4vc3JjJ1xuICBvcHRpb25zLnRoZW1lID0gb3B0aW9ucy50aGVtZSB8fCBwcm9qZWN0Lm9wdGlvbnMudGhlbWUgfHwgJ2RlZmF1bHQnXG5cbiAgcmVxdWlyZShgJHsgcGF0aFRvRGV2cGFjayhvcHRpb25zLmRldlRvb2xzUGF0aCkgfS9saWIvc2VydmVyYCkob3B0aW9ucylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhdW5jaFR1bm5lbChvcHRpb25zLCBjb250ZXh0KSB7XG4gIHZhciBzZXJ2ZXIgPSBzaGVsbC5leGVjKGBuZ3JvayBodHRwICR7IG9wdGlvbnMucG9ydCB9YCwge2FzeW5jOiB0cnVlfSlcblxuICBzZXJ2ZXIuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICBpZighb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgfVxuICB9KVxuXG4gIHNlcnZlci5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgIGlmKG9wdGlvbnMuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBwYXRoVG9EZXZwYWNrIChvcHQpIHtcbiAgcmV0dXJuIHJlc29sdmUob3B0KSB8fCBwcm9jZXNzLmVudi5TS1lQQUdFUl9ERVZQQUNLX1BBVEggfHwgZGlybmFtZShcbiAgICByZXF1aXJlLnJlc29sdmUoJ3NreXBhZ2VyLWRldnBhY2snKVxuICApXG59XG5cbmZ1bmN0aW9uIGlzRGVwYWNrSW5zdGFsbGVkICgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcGF0aFRvRGV2cGFjaygpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==