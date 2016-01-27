'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.develop = develop;
exports.handle = handle;
exports.launchWatcher = launchWatcher;
exports.launchServer = launchServer;
exports.launchTunnel = launchTunnel;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function develop(program, dispatch) {
  program.command('dev [entry]').alias('develop').alias('dev-server').description('run a development server for this project').option('--port <port>', 'which port should this server listen on?', 3000).option('--host <hostname>', 'which hostname should this server listen on?', 'localhost').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--ngrok', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server').option('--ngrok-config <path>', 'path to a configuration file for the ngrok service').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').option('--dev-tools-path <path>', 'path to the skypager-devpack devtools library').option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config').option('--watch-bundle', 'watch for content changes in the project and update the distribution bundle').option('--middleware <path>', 'apply express middleware to the dev-server').action(dispatch(handle));
}

exports.default = develop;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  launchServer(entry, options, context);

  if (options.watchBundle) {
    launchWatcher(options, context);
  }

  if (options.ngrok) {
    launchTunnel(options, context);
  }
}

function launchWatcher(options, context) {
  var project = context.project;
  var proc = _shelljs2.default.exec('chokidar \'./{data,docs}/**/*.{md,js,less,css,yml,json,csv,html,svg}\' -c \'skypager export bundle\'', { async: true });

  proc.stdout.on('data', function (data) {
    if (!options.silent) {
      console.log(data);
    }
  });

  proc.stderr.on('data', function (data) {
    if (options.debug) {
      console.log(data);
    }
  });
}

function launchServer(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var project = context.project;

  options.entry = entry || options.entry || project.options.entry || './src';
  options.theme = options.theme || project.options.theme || 'marketing';

  require(pathToDevpack(options.devToolsPath) + '/webpack/server')(options);
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
  return opt && (0, _path.resolve)(opt) || process.env.SKYPAGER_DEVPACK_PATH || (0, _path.dirname)(require.resolve('skypager-devpack'));
}

function isDepackInstalled() {
  try {
    return pathToDevpack();
  } catch (error) {
    return false;
  }
}
//# sourceMappingURL=data:application/json;base64,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QUFFRCxTQUFTLGFBQWEsQ0FBRSxHQUFHLEVBQUU7QUFBRSxTQUFPLEFBQUMsR0FBRyxJQUFJLFVBdEYvQixPQUFPLEVBc0ZnQyxHQUFHLENBQUMsSUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLFVBdEY1RSxPQUFPLEVBc0Y4RSxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtDQUFFOztBQUVuSixTQUFTLGlCQUFpQixHQUFJO0FBQzVCLE1BQUk7QUFDRixXQUFPLGFBQWEsRUFBRSxDQUFBO0dBQ3ZCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxXQUFPLEtBQUssQ0FBQTtHQUNiO0NBQ0YiLCJmaWxlIjoiZGV2ZWxvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZlbG9wIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2RldiBbZW50cnldJylcbiAgICAuYWxpYXMoJ2RldmVsb3AnKVxuICAgIC5hbGlhcygnZGV2LXNlcnZlcicpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gYSBkZXZlbG9wbWVudCBzZXJ2ZXIgZm9yIHRoaXMgcHJvamVjdCcpXG4gICAgLm9wdGlvbignLS1wb3J0IDxwb3J0PicsICd3aGljaCBwb3J0IHNob3VsZCB0aGlzIHNlcnZlciBsaXN0ZW4gb24/JywgMzAwMClcbiAgICAub3B0aW9uKCctLWhvc3QgPGhvc3RuYW1lPicsICd3aGljaCBob3N0bmFtZSBzaG91bGQgdGhpcyBzZXJ2ZXIgbGlzdGVuIG9uPycsICdsb2NhbGhvc3QnKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1wbGF0Zm9ybSA8bmFtZT4nLCAnd2hpY2ggcGxhdGZvcm0gYXJlIHdlIGJ1aWxkaW5nIGZvcj8gZWxlY3Ryb24gb3Igd2ViJywgJ3dlYicpXG4gICAgLm9wdGlvbignLS10aGVtZSA8bmFtZT4nLCAndGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZScpXG4gICAgLm9wdGlvbignLS1odG1sLXRlbXBsYXRlLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIGh0bWwgdGVtcGxhdGUgdG8gdXNlJylcbiAgICAub3B0aW9uKCctLXByZWNvbXBpbGVkIDxuYW1lPicsICd1c2UgYSBwcmVjb21waWxlZCBodG1sIHRlbXBsYXRlIHdoaWNoIGluY2x1ZGVzIHZlbmRvciBsaWJzLCB0aGVtZXMsIGV0YycpXG4gICAgLm9wdGlvbignLS1uZ3JvaycsICd3aGVuIGVuYWJsZWQsIHdpbGwgYXR0ZW1wdCB0byB1c2Ugbmdyb2sgdG8gZXhwb3NlIGEgcHVibGljIEFQSSBlbmRwb2ludCBmb3IgdGhpcyBzZXJ2ZXInKVxuICAgIC5vcHRpb24oJy0tbmdyb2stY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgY29uZmlndXJhdGlvbiBmaWxlIGZvciB0aGUgbmdyb2sgc2VydmljZScpXG4gICAgLm9wdGlvbignLS1zaWxlbnQnLCAnc3VwcHJlc3MgYW55IHNlcnZlciBvdXRwdXQnKVxuICAgIC5vcHRpb24oJy0tZGVidWcnLCAnc2hvdyBlcnJvciBpbmZvIGZyb20gdGhlIHNlcnZlcicpXG4gICAgLm9wdGlvbignLS1kZXYtdG9vbHMtcGF0aCA8cGF0aD4nLCAncGF0aCB0byB0aGUgc2t5cGFnZXItZGV2cGFjayBkZXZ0b29scyBsaWJyYXJ5JylcbiAgICAub3B0aW9uKCctLXdlYnBhY2stY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgamF2YXNjcmlwdCBmdW5jdGlvbiB3aGljaCBjYW4gbXV0YXRlIHRoZSB3ZWJwYWNrIGNvbmZpZycpXG4gICAgLm9wdGlvbignLS13YXRjaC1idW5kbGUnLCAnd2F0Y2ggZm9yIGNvbnRlbnQgY2hhbmdlcyBpbiB0aGUgcHJvamVjdCBhbmQgdXBkYXRlIHRoZSBkaXN0cmlidXRpb24gYnVuZGxlJylcbiAgICAub3B0aW9uKCctLW1pZGRsZXdhcmUgPHBhdGg+JywgJ2FwcGx5IGV4cHJlc3MgbWlkZGxld2FyZSB0byB0aGUgZGV2LXNlcnZlcicpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZXZlbG9wXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsYXVuY2hTZXJ2ZXIoZW50cnksIG9wdGlvbnMsIGNvbnRleHQpXG5cbiAgaWYgKG9wdGlvbnMud2F0Y2hCdW5kbGUpIHtcbiAgICBsYXVuY2hXYXRjaGVyKG9wdGlvbnMsIGNvbnRleHQpXG4gIH1cblxuICBpZiAob3B0aW9ucy5uZ3Jvaykge1xuICAgIGxhdW5jaFR1bm5lbChvcHRpb25zLCBjb250ZXh0KVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hXYXRjaGVyKG9wdGlvbnMsIGNvbnRleHQpIHtcbiAgbGV0IHByb2plY3QgPSBjb250ZXh0LnByb2plY3RcbiAgdmFyIHByb2MgPSBzaGVsbC5leGVjKGBjaG9raWRhciAnLi97ZGF0YSxkb2NzfS8qKi8qLnttZCxqcyxsZXNzLGNzcyx5bWwsanNvbixjc3YsaHRtbCxzdmd9JyAtYyAnc2t5cGFnZXIgZXhwb3J0IGJ1bmRsZSdgLCB7YXN5bmM6IHRydWV9KVxuXG4gIHByb2Muc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICBpZighb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgfVxuICB9KVxuXG4gIHByb2Muc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICBpZihvcHRpb25zLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhdW5jaFNlcnZlciAoZW50cnksIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0XG5cbiAgb3B0aW9ucy5lbnRyeSA9IGVudHJ5IHx8IG9wdGlvbnMuZW50cnkgfHwgcHJvamVjdC5vcHRpb25zLmVudHJ5IHx8ICcuL3NyYydcbiAgb3B0aW9ucy50aGVtZSA9IG9wdGlvbnMudGhlbWUgfHwgcHJvamVjdC5vcHRpb25zLnRoZW1lIHx8ICdtYXJrZXRpbmcnXG5cbiAgcmVxdWlyZShgJHsgcGF0aFRvRGV2cGFjayhvcHRpb25zLmRldlRvb2xzUGF0aCkgfS93ZWJwYWNrL3NlcnZlcmApKG9wdGlvbnMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hUdW5uZWwob3B0aW9ucywgY29udGV4dCkge1xuICB2YXIgc2VydmVyID0gc2hlbGwuZXhlYyhgbmdyb2sgaHR0cCAkeyBvcHRpb25zLnBvcnQgfWAsIHthc3luYzogdHJ1ZX0pXG5cbiAgc2VydmVyLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgaWYoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgIH1cbiAgfSlcblxuICBzZXJ2ZXIuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICBpZihvcHRpb25zLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcGF0aFRvRGV2cGFjayAob3B0KSB7IHJldHVybiAob3B0ICYmIHJlc29sdmUob3B0KSkgfHwgcHJvY2Vzcy5lbnYuU0tZUEFHRVJfREVWUEFDS19QQVRIIHx8IGRpcm5hbWUoIHJlcXVpcmUucmVzb2x2ZSgnc2t5cGFnZXItZGV2cGFjaycpKSB9XG5cbmZ1bmN0aW9uIGlzRGVwYWNrSW5zdGFsbGVkICgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcGF0aFRvRGV2cGFjaygpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==