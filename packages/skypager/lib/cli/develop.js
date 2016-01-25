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
  program.command('develop [entry]').description('run a development server for this project').option('--port <port>', 'which port should this server listen on?', 3000).option('--host <hostname>', 'which hostname should this server listen on?', 'localhost').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--ngrok', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server').option('--ngrok-config <path>', 'path to a configuration file for the ngrok service').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').option('--dev-tools-path <path>', 'path to the skypager-devpack devtools library').option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config').option('--watch-bundle', 'watch for content changes in the project and update the distribution bundle').action(dispatch(handle));
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

  options.entry = entry || options.entry || './src';
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
//# sourceMappingURL=data:application/json;base64,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LFVBbkY1RSxPQUFPLEVBbUY4RSxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtDQUFFOztBQUVuSixTQUFTLGlCQUFpQixHQUFJO0FBQzVCLE1BQUk7QUFDRixXQUFPLGFBQWEsRUFBRSxDQUFBO0dBQ3ZCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxXQUFPLEtBQUssQ0FBQTtHQUNiO0NBQ0YiLCJmaWxlIjoiZGV2ZWxvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZlbG9wIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2RldmVsb3AgW2VudHJ5XScpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gYSBkZXZlbG9wbWVudCBzZXJ2ZXIgZm9yIHRoaXMgcHJvamVjdCcpXG4gICAgLm9wdGlvbignLS1wb3J0IDxwb3J0PicsICd3aGljaCBwb3J0IHNob3VsZCB0aGlzIHNlcnZlciBsaXN0ZW4gb24/JywgMzAwMClcbiAgICAub3B0aW9uKCctLWhvc3QgPGhvc3RuYW1lPicsICd3aGljaCBob3N0bmFtZSBzaG91bGQgdGhpcyBzZXJ2ZXIgbGlzdGVuIG9uPycsICdsb2NhbGhvc3QnKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1wbGF0Zm9ybSA8bmFtZT4nLCAnd2hpY2ggcGxhdGZvcm0gYXJlIHdlIGJ1aWxkaW5nIGZvcj8gZWxlY3Ryb24gb3Igd2ViJywgJ3dlYicpXG4gICAgLm9wdGlvbignLS10aGVtZSA8bmFtZT4nLCAndGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZScpXG4gICAgLm9wdGlvbignLS1odG1sLXRlbXBsYXRlLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIGh0bWwgdGVtcGxhdGUgdG8gdXNlJylcbiAgICAub3B0aW9uKCctLXByZWNvbXBpbGVkIDxuYW1lPicsICd1c2UgYSBwcmVjb21waWxlZCBodG1sIHRlbXBsYXRlIHdoaWNoIGluY2x1ZGVzIHZlbmRvciBsaWJzLCB0aGVtZXMsIGV0YycpXG4gICAgLm9wdGlvbignLS1uZ3JvaycsICd3aGVuIGVuYWJsZWQsIHdpbGwgYXR0ZW1wdCB0byB1c2Ugbmdyb2sgdG8gZXhwb3NlIGEgcHVibGljIEFQSSBlbmRwb2ludCBmb3IgdGhpcyBzZXJ2ZXInKVxuICAgIC5vcHRpb24oJy0tbmdyb2stY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgY29uZmlndXJhdGlvbiBmaWxlIGZvciB0aGUgbmdyb2sgc2VydmljZScpXG4gICAgLm9wdGlvbignLS1zaWxlbnQnLCAnc3VwcHJlc3MgYW55IHNlcnZlciBvdXRwdXQnKVxuICAgIC5vcHRpb24oJy0tZGVidWcnLCAnc2hvdyBlcnJvciBpbmZvIGZyb20gdGhlIHNlcnZlcicpXG4gICAgLm9wdGlvbignLS1kZXYtdG9vbHMtcGF0aCA8cGF0aD4nLCAncGF0aCB0byB0aGUgc2t5cGFnZXItZGV2cGFjayBkZXZ0b29scyBsaWJyYXJ5JylcbiAgICAub3B0aW9uKCctLXdlYnBhY2stY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgamF2YXNjcmlwdCBmdW5jdGlvbiB3aGljaCBjYW4gbXV0YXRlIHRoZSB3ZWJwYWNrIGNvbmZpZycpXG4gICAgLm9wdGlvbignLS13YXRjaC1idW5kbGUnLCAnd2F0Y2ggZm9yIGNvbnRlbnQgY2hhbmdlcyBpbiB0aGUgcHJvamVjdCBhbmQgdXBkYXRlIHRoZSBkaXN0cmlidXRpb24gYnVuZGxlJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRldmVsb3BcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSAoZW50cnksIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGxhdW5jaFNlcnZlcihlbnRyeSwgb3B0aW9ucywgY29udGV4dClcblxuICBpZiAob3B0aW9ucy53YXRjaEJ1bmRsZSkge1xuICAgIGxhdW5jaFdhdGNoZXIob3B0aW9ucywgY29udGV4dClcbiAgfVxuXG4gIGlmIChvcHRpb25zLm5ncm9rKSB7XG4gICAgbGF1bmNoVHVubmVsKG9wdGlvbnMsIGNvbnRleHQpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhdW5jaFdhdGNoZXIob3B0aW9ucywgY29udGV4dCkge1xuICBsZXQgcHJvamVjdCA9IGNvbnRleHQucHJvamVjdFxuICB2YXIgcHJvYyA9IHNoZWxsLmV4ZWMoYGNob2tpZGFyICcuL3tkYXRhLGRvY3N9LyoqLyoue21kLGpzLGxlc3MsY3NzLHltbCxqc29uLGNzdixodG1sLHN2Z30nIC1jICdza3lwYWdlciBleHBvcnQgYnVuZGxlJ2AsIHthc3luYzogdHJ1ZX0pXG5cbiAgcHJvYy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgIGlmKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICB9XG4gIH0pXG5cbiAgcHJvYy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgIGlmKG9wdGlvbnMuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoU2VydmVyIChlbnRyeSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSBjb250ZXh0LnByb2plY3RcblxuICBvcHRpb25zLmVudHJ5ID0gZW50cnkgfHwgb3B0aW9ucy5lbnRyeSB8fCAnLi9zcmMnXG4gIG9wdGlvbnMudGhlbWUgPSBvcHRpb25zLnRoZW1lIHx8IHByb2plY3Qub3B0aW9ucy50aGVtZSB8fCAnbWFya2V0aW5nJ1xuXG4gIHJlcXVpcmUoYCR7IHBhdGhUb0RldnBhY2sob3B0aW9ucy5kZXZUb29sc1BhdGgpIH0vd2VicGFjay9zZXJ2ZXJgKShvcHRpb25zKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoVHVubmVsKG9wdGlvbnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlcnZlciA9IHNoZWxsLmV4ZWMoYG5ncm9rIGh0dHAgJHsgb3B0aW9ucy5wb3J0IH1gLCB7YXN5bmM6IHRydWV9KVxuXG4gIHNlcnZlci5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgIGlmKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICB9XG4gIH0pXG5cbiAgc2VydmVyLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgaWYob3B0aW9ucy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHBhdGhUb0RldnBhY2sgKG9wdCkgeyByZXR1cm4gKG9wdCAmJiByZXNvbHZlKG9wdCkpIHx8IHByb2Nlc3MuZW52LlNLWVBBR0VSX0RFVlBBQ0tfUEFUSCB8fCBkaXJuYW1lKCByZXF1aXJlLnJlc29sdmUoJ3NreXBhZ2VyLWRldnBhY2snKSkgfVxuXG5mdW5jdGlvbiBpc0RlcGFja0luc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhdGhUb0RldnBhY2soKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=