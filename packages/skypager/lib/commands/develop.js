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
  program.command('dev [entry]').alias('develop').alias('dev-server').description('run a development server for this project').option('--port <port>', 'which port should this server listen on?', 3000).option('--host <hostname>', 'which hostname should this server listen on?', 'localhost').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--ngrok', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server').option('--ngrok-config <path>', 'path to a configuration file for the ngrok service').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').option('--dev-tools-path <path>', 'path to the skypager-devpack devtools library').option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config').option('--bundle', 'watch for content changes in the project and update the distribution bundle').option('--bundle-command', 'the command to run to generate the bundle default: skypager export bundle', 'skypager export bundle').option('--middleware <path>', 'apply express middleware to the dev-server').option('--modules-path <path>', 'which modules folder to use for webpacks default? defaults to standard node_modules').option('--feature-flags <path>', 'path to a script which exports an object to be used for feature flags').option('--skip-theme', 'do not include a theme').option('--entry-only', 'do not use html template').option('--dist-path <path>', 'the project exporter or dist path').option('--external-vendors', "assume vendor libraries will be available to our script").option('--no-vendor-libraries', "don't include any vendor libraries in the bundle").option('--export-library <name>', 'build this as a umd library').option('--template-inject [target]', 'where to inject the webpack bundle? none, body, head').action(dispatch(handle));
}

exports.default = develop;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var project = context.project;

  launchWatcher(options, context);

  launchServer(entry, options, context);

  if (options.ngrok) {
    launchTunnel(options, context);
  }
}

function launchWatcher(options, context) {
  var project = context.project;

  var bundleCommand = options.bundleCommand || 'skypager export bundle';

  console.log('Exporting project bundle'.green);
  _shelljs2.default.exec(bundleCommand + ' --clean');

  console.log('Launching project bundler'.yellow);
  var proc = _shelljs2.default.exec('chokidar \'./{data,docs}/**/*.*\' --silent --ignore --debounce 1200 -c \'' + bundleCommand + '\'', { async: true });

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

  options.staticAssets = options.staticAssets || project.options.staticAssets || {};

  console.log('Launching server'.cyan);
  process.env.NODE_ENV = 'development';
  require(pathToDevpack(options.devToolsPath) + '/webpack/server')(options);
}

function launchTunnel(options, context) {
  var server = _shelljs2.default.exec('ngrok http ' + (options.port || 3000), { async: true });

  console.log(server);

  server.stdout.on('data', function (data) {
    console.log(data);
  });

  server.stderr.on('data', function (data) {
    console.log(data);
  });

  server.on('end', function () {
    console.log('Ngrok tunnel ended');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9kZXZlbG9wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBS2dCLE9BQU8sR0FBUCxPQUFPO1FBcUNQLE1BQU0sR0FBTixNQUFNO1FBWU4sYUFBYSxHQUFiLGFBQWE7UUF3QmIsWUFBWSxHQUFaLFlBQVk7UUFhWixZQUFZLEdBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7QUF0RnJCLFNBQVMsT0FBTyxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDMUMsU0FBTyxDQUNKLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FDdEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUNoQixLQUFLLENBQUMsWUFBWSxDQUFDLENBQ25CLFdBQVcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUN4RCxNQUFNLENBQUMsZUFBZSxFQUFFLDBDQUEwQyxFQUFFLElBQUksQ0FBQyxDQUN6RSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsOENBQThDLEVBQUUsV0FBVyxDQUFDLENBQ3hGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FDckUsTUFBTSxDQUFDLHFCQUFxQixFQUFFLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUMzRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUscURBQXFELEVBQUUsS0FBSyxDQUFDLENBQ3pGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSw4QkFBOEIsQ0FBQyxDQUN4RCxNQUFNLENBQUMsNkJBQTZCLEVBQUUsa0NBQWtDLENBQUMsQ0FDekUsTUFBTSxDQUFDLHNCQUFzQixFQUFFLHlFQUF5RSxDQUFDLENBQ3pHLE1BQU0sQ0FBQyxTQUFTLEVBQUUseUZBQXlGLENBQUMsQ0FDNUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLG9EQUFvRCxDQUFDLENBQ3JGLE1BQU0sQ0FBQyxVQUFVLEVBQUUsNEJBQTRCLENBQUMsQ0FDaEQsTUFBTSxDQUFDLFNBQVMsRUFBRSxpQ0FBaUMsQ0FBQyxDQUNwRCxNQUFNLENBQUMseUJB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LGFBQWEsQ0FBRSxHQUFHLEVBQUU7QUFBRSxTQUFPLEFBQUMsR0FBRyxJQUFJLFVBN0cvQixPQUFPLEVBNkdnQyxHQUFHLENBQUMsSUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLFVBN0c1RSxPQUFPLEVBNkc4RSxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtDQUFFOztBQUVuSixTQUFTLGlCQUFpQixHQUFJO0FBQzVCLE1BQUk7QUFDRixXQUFPLGFBQWEsRUFBRSxDQUFBO0dBQ3ZCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxXQUFPLEtBQUssQ0FBQTtHQUNiO0NBQ0YiLCJmaWxlIjoiZGV2ZWxvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZlbG9wIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2RldiBbZW50cnldJylcbiAgICAuYWxpYXMoJ2RldmVsb3AnKVxuICAgIC5hbGlhcygnZGV2LXNlcnZlcicpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gYSBkZXZlbG9wbWVudCBzZXJ2ZXIgZm9yIHRoaXMgcHJvamVjdCcpXG4gICAgLm9wdGlvbignLS1wb3J0IDxwb3J0PicsICd3aGljaCBwb3J0IHNob3VsZCB0aGlzIHNlcnZlciBsaXN0ZW4gb24/JywgMzAwMClcbiAgICAub3B0aW9uKCctLWhvc3QgPGhvc3RuYW1lPicsICd3aGljaCBob3N0bmFtZSBzaG91bGQgdGhpcyBzZXJ2ZXIgbGlzdGVuIG9uPycsICdsb2NhbGhvc3QnKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1wbGF0Zm9ybSA8bmFtZT4nLCAnd2hpY2ggcGxhdGZvcm0gYXJlIHdlIGJ1aWxkaW5nIGZvcj8gZWxlY3Ryb24gb3Igd2ViJywgJ3dlYicpXG4gICAgLm9wdGlvbignLS10aGVtZSA8bmFtZT4nLCAndGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZScpXG4gICAgLm9wdGlvbignLS1odG1sLXRlbXBsYXRlLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIGh0bWwgdGVtcGxhdGUgdG8gdXNlJylcbiAgICAub3B0aW9uKCctLXByZWNvbXBpbGVkIDxuYW1lPicsICd1c2UgYSBwcmVjb21waWxlZCBodG1sIHRlbXBsYXRlIHdoaWNoIGluY2x1ZGVzIHZlbmRvciBsaWJzLCB0aGVtZXMsIGV0YycpXG4gICAgLm9wdGlvbignLS1uZ3JvaycsICd3aGVuIGVuYWJsZWQsIHdpbGwgYXR0ZW1wdCB0byB1c2Ugbmdyb2sgdG8gZXhwb3NlIGEgcHVibGljIEFQSSBlbmRwb2ludCBmb3IgdGhpcyBzZXJ2ZXInKVxuICAgIC5vcHRpb24oJy0tbmdyb2stY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgY29uZmlndXJhdGlvbiBmaWxlIGZvciB0aGUgbmdyb2sgc2VydmljZScpXG4gICAgLm9wdGlvbignLS1zaWxlbnQnLCAnc3VwcHJlc3MgYW55IHNlcnZlciBvdXRwdXQnKVxuICAgIC5vcHRpb24oJy0tZGVidWcnLCAnc2hvdyBlcnJvciBpbmZvIGZyb20gdGhlIHNlcnZlcicpXG4gICAgLm9wdGlvbignLS1kZXYtdG9vbHMtcGF0aCA8cGF0aD4nLCAncGF0aCB0byB0aGUgc2t5cGFnZXItZGV2cGFjayBkZXZ0b29scyBsaWJyYXJ5JylcbiAgICAub3B0aW9uKCctLXdlYnBhY2stY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgamF2YXNjcmlwdCBmdW5jdGlvbiB3aGljaCBjYW4gbXV0YXRlIHRoZSB3ZWJwYWNrIGNvbmZpZycpXG4gICAgLm9wdGlvbignLS1idW5kbGUnLCAnd2F0Y2ggZm9yIGNvbnRlbnQgY2hhbmdlcyBpbiB0aGUgcHJvamVjdCBhbmQgdXBkYXRlIHRoZSBkaXN0cmlidXRpb24gYnVuZGxlJylcbiAgICAub3B0aW9uKCctLWJ1bmRsZS1jb21tYW5kJywgJ3RoZSBjb21tYW5kIHRvIHJ1biB0byBnZW5lcmF0ZSB0aGUgYnVuZGxlIGRlZmF1bHQ6IHNreXBhZ2VyIGV4cG9ydCBidW5kbGUnLCAnc2t5cGFnZXIgZXhwb3J0IGJ1bmRsZScpXG4gICAgLm9wdGlvbignLS1taWRkbGV3YXJlIDxwYXRoPicsICdhcHBseSBleHByZXNzIG1pZGRsZXdhcmUgdG8gdGhlIGRldi1zZXJ2ZXInKVxuICAgIC5vcHRpb24oJy0tbW9kdWxlcy1wYXRoIDxwYXRoPicsICd3aGljaCBtb2R1bGVzIGZvbGRlciB0byB1c2UgZm9yIHdlYnBhY2tzIGRlZmF1bHQ/IGRlZmF1bHRzIHRvIHN0YW5kYXJkIG5vZGVfbW9kdWxlcycpXG4gICAgLm9wdGlvbignLS1mZWF0dXJlLWZsYWdzIDxwYXRoPicsICdwYXRoIHRvIGEgc2NyaXB0IHdoaWNoIGV4cG9ydHMgYW4gb2JqZWN0IHRvIGJlIHVzZWQgZm9yIGZlYXR1cmUgZmxhZ3MnKVxuICAgIC5vcHRpb24oJy0tc2tpcC10aGVtZScsICdkbyBub3QgaW5jbHVkZSBhIHRoZW1lJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW9ubHknLCAnZG8gbm90IHVzZSBodG1sIHRlbXBsYXRlJylcbiAgICAub3B0aW9uKCctLWRpc3QtcGF0aCA8cGF0aD4nLCAndGhlIHByb2plY3QgZXhwb3J0ZXIgb3IgZGlzdCBwYXRoJylcbiAgICAub3B0aW9uKCctLWV4dGVybmFsLXZlbmRvcnMnLCBcImFzc3VtZSB2ZW5kb3IgbGlicmFyaWVzIHdpbGwgYmUgYXZhaWxhYmxlIHRvIG91ciBzY3JpcHRcIilcbiAgICAub3B0aW9uKCctLW5vLXZlbmRvci1saWJyYXJpZXMnLCBcImRvbid0IGluY2x1ZGUgYW55IHZlbmRvciBsaWJyYXJpZXMgaW4gdGhlIGJ1bmRsZVwiKVxuICAgIC5vcHRpb24oJy0tZXhwb3J0LWxpYnJhcnkgPG5hbWU+JywgJ2J1aWxkIHRoaXMgYXMgYSB1bWQgbGlicmFyeScpXG4gICAgLm9wdGlvbignLS10ZW1wbGF0ZS1pbmplY3QgW3RhcmdldF0nLCAnd2hlcmUgdG8gaW5qZWN0IHRoZSB3ZWJwYWNrIGJ1bmRsZT8gbm9uZSwgYm9keSwgaGVhZCcpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZXZlbG9wXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IGNvbnRleHQucHJvamVjdFxuXG4gIGxhdW5jaFdhdGNoZXIob3B0aW9ucywgY29udGV4dClcblxuICBsYXVuY2hTZXJ2ZXIoZW50cnksIG9wdGlvbnMsIGNvbnRleHQpXG5cbiAgaWYgKG9wdGlvbnMubmdyb2spIHtcbiAgICBsYXVuY2hUdW5uZWwob3B0aW9ucywgY29udGV4dClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoV2F0Y2hlcihvcHRpb25zLCBjb250ZXh0KSB7XG4gIGxldCBwcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0XG5cbiAgbGV0IGJ1bmRsZUNvbW1hbmQgPSBvcHRpb25zLmJ1bmRsZUNvbW1hbmQgfHwgJ3NreXBhZ2VyIGV4cG9ydCBidW5kbGUnXG5cbiAgY29uc29sZS5sb2coJ0V4cG9ydGluZyBwcm9qZWN0IGJ1bmRsZScuZ3JlZW4pXG4gIHNoZWxsLmV4ZWMoYCR7IGJ1bmRsZUNvbW1hbmQgfSAtLWNsZWFuYClcblxuICBjb25zb2xlLmxvZygnTGF1bmNoaW5nIHByb2plY3QgYnVuZGxlcicueWVsbG93KVxuICB2YXIgcHJvYyA9IHNoZWxsLmV4ZWMoYGNob2tpZGFyICcuL3tkYXRhLGRvY3N9LyoqLyouKicgLS1zaWxlbnQgLS1pZ25vcmUgLS1kZWJvdW5jZSAxMjAwIC1jICckeyBidW5kbGVDb21tYW5kIH0nYCwge2FzeW5jOiB0cnVlfSlcblxuICBwcm9jLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgaWYoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgIH1cbiAgfSlcblxuICBwcm9jLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgaWYob3B0aW9ucy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hTZXJ2ZXIgKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IGNvbnRleHQucHJvamVjdFxuXG4gIG9wdGlvbnMuZW50cnkgPSBlbnRyeSB8fCBvcHRpb25zLmVudHJ5IHx8IHByb2plY3Qub3B0aW9ucy5lbnRyeSB8fCAnLi9zcmMnXG4gIG9wdGlvbnMudGhlbWUgPSBvcHRpb25zLnRoZW1lIHx8IHByb2plY3Qub3B0aW9ucy50aGVtZSB8fCAnbWFya2V0aW5nJ1xuXG4gIG9wdGlvbnMuc3RhdGljQXNzZXRzID0gb3B0aW9ucy5zdGF0aWNBc3NldHMgfHwgcHJvamVjdC5vcHRpb25zLnN0YXRpY0Fzc2V0cyB8fCB7fVxuXG4gIGNvbnNvbGUubG9nKCdMYXVuY2hpbmcgc2VydmVyJy5jeWFuKVxuICBwcm9jZXNzLmVudi5OT0RFX0VOViA9ICdkZXZlbG9wbWVudCdcbiAgcmVxdWlyZShgJHsgcGF0aFRvRGV2cGFjayhvcHRpb25zLmRldlRvb2xzUGF0aCkgfS93ZWJwYWNrL3NlcnZlcmApKG9wdGlvbnMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hUdW5uZWwob3B0aW9ucywgY29udGV4dCkge1xuICB2YXIgc2VydmVyID0gc2hlbGwuZXhlYyhgbmdyb2sgaHR0cCAkeyBvcHRpb25zLnBvcnQgfHwgMzAwMCB9YCwge2FzeW5jOiB0cnVlfSlcblxuICBjb25zb2xlLmxvZyhzZXJ2ZXIpXG5cbiAgc2VydmVyLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSlcbiAgfSlcblxuICBzZXJ2ZXIuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKVxuICB9KVxuXG4gIHNlcnZlci5vbignZW5kJywgKCkgPT4ge1xuICAgICBjb25zb2xlLmxvZygnTmdyb2sgdHVubmVsIGVuZGVkJylcbiAgfSlcbn1cblxuZnVuY3Rpb24gcGF0aFRvRGV2cGFjayAob3B0KSB7IHJldHVybiAob3B0ICYmIHJlc29sdmUob3B0KSkgfHwgcHJvY2Vzcy5lbnYuU0tZUEFHRVJfREVWUEFDS19QQVRIIHx8IGRpcm5hbWUoIHJlcXVpcmUucmVzb2x2ZSgnc2t5cGFnZXItZGV2cGFjaycpKSB9XG5cbmZ1bmN0aW9uIGlzRGVwYWNrSW5zdGFsbGVkICgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcGF0aFRvRGV2cGFjaygpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==