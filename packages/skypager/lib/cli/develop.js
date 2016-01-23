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
  program.command('develop [entry]').description('run a development server for this project').option('--port <port>', 'which port should this server listen on?', 3000).option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use', 'dashboard').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--expose', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server').option('--expose-config <path>', 'path to a configuration file for the expose service').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').action(dispatch(handle));
}

exports.default = develop;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  console.log('Launching dev server');
  launchServer(entry, options, context);

  if (options.expose) {
    console.log('Launching tunnel');
    launchTunnel(options, context);
  }
}

function launchServer(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var entryPoint = entry || options.entry;
  var cmd = 'skypager-devpack start ' + process.argv.slice(3).join(' ') + ' --entry ' + entryPoint;

  var server = _shelljs2.default.exec(cmd, { async: true });

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
//# sourceMappingURL=data:application/json;base64,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LEVBQUU7QUFDN0MsTUFBSSxNQUFNLEdBQUcsa0JBQU0sSUFBSSxpQkFBZ0IsT0FBTyxDQUFDLElBQUksRUFBSyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBOztBQUV0RSxRQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDakMsUUFBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQjtHQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDakMsUUFBRyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ2hCLGFBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEI7R0FDRixDQUFDLENBQUE7Q0FDSDs7QUFFRCxTQUFTLGFBQWEsR0FBSTtBQUN4QixTQUFPLFVBdkVNLE9BQU8sRUF3RWxCLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FDcEMsQ0FBQTtDQUNGOztBQUVELFNBQVMsaUJBQWlCLEdBQUk7QUFDNUIsTUFBSTtBQUNGLFdBQU8sYUFBYSxFQUFFLENBQUE7R0FDdkIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFdBQU8sS0FBSyxDQUFBO0dBQ2I7Q0FDRiIsImZpbGUiOiJkZXZlbG9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgam9pbiwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbGpzJ1xuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIGRldmVsb3AgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnZGV2ZWxvcCBbZW50cnldJylcbiAgICAuZGVzY3JpcHRpb24oJ3J1biBhIGRldmVsb3BtZW50IHNlcnZlciBmb3IgdGhpcyBwcm9qZWN0JylcbiAgICAub3B0aW9uKCctLXBvcnQgPHBvcnQ+JywgJ3doaWNoIHBvcnQgc2hvdWxkIHRoaXMgc2VydmVyIGxpc3RlbiBvbj8nLCAzMDAwKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1wbGF0Zm9ybSA8bmFtZT4nLCAnd2hpY2ggcGxhdGZvcm0gYXJlIHdlIGJ1aWxkaW5nIGZvcj8gZWxlY3Ryb24gb3Igd2ViJywgJ3dlYicpXG4gICAgLm9wdGlvbignLS10aGVtZSA8bmFtZT4nLCAndGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZScsICdkYXNoYm9hcmQnKVxuICAgIC5vcHRpb24oJy0taHRtbC10ZW1wbGF0ZS1wYXRoIDxwYXRoPicsICdwYXRoIHRvIHRoZSBodG1sIHRlbXBsYXRlIHRvIHVzZScpXG4gICAgLm9wdGlvbignLS1wcmVjb21waWxlZCA8bmFtZT4nLCAndXNlIGEgcHJlY29tcGlsZWQgaHRtbCB0ZW1wbGF0ZSB3aGljaCBpbmNsdWRlcyB2ZW5kb3IgbGlicywgdGhlbWVzLCBldGMnKVxuICAgIC5vcHRpb24oJy0tZXhwb3NlJywgJ3doZW4gZW5hYmxlZCwgd2lsbCBhdHRlbXB0IHRvIHVzZSBuZ3JvayB0byBleHBvc2UgYSBwdWJsaWMgQVBJIGVuZHBvaW50IGZvciB0aGlzIHNlcnZlcicpXG4gICAgLm9wdGlvbignLS1leHBvc2UtY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgY29uZmlndXJhdGlvbiBmaWxlIGZvciB0aGUgZXhwb3NlIHNlcnZpY2UnKVxuICAgIC5vcHRpb24oJy0tc2lsZW50JywgJ3N1cHByZXNzIGFueSBzZXJ2ZXIgb3V0cHV0JylcbiAgICAub3B0aW9uKCctLWRlYnVnJywgJ3Nob3cgZXJyb3IgaW5mbyBmcm9tIHRoZSBzZXJ2ZXInKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGV2ZWxvcFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlIChlbnRyeSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc29sZS5sb2coJ0xhdW5jaGluZyBkZXYgc2VydmVyJylcbiAgbGF1bmNoU2VydmVyKGVudHJ5LCBvcHRpb25zLCBjb250ZXh0KVxuXG4gIGlmIChvcHRpb25zLmV4cG9zZSkge1xuICAgIGNvbnNvbGUubG9nKCdMYXVuY2hpbmcgdHVubmVsJylcbiAgICBsYXVuY2hUdW5uZWwob3B0aW9ucywgY29udGV4dClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoU2VydmVyIChlbnRyeSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgbGV0IGVudHJ5UG9pbnQgPSBlbnRyeSB8fCBvcHRpb25zLmVudHJ5XG4gIGxldCBjbWQgPSBgc2t5cGFnZXItZGV2cGFjayBzdGFydCAkeyBwcm9jZXNzLmFyZ3Yuc2xpY2UoMykuam9pbignICcpIH0gLS1lbnRyeSAkeyBlbnRyeVBvaW50IH1gXG5cbiAgdmFyIHNlcnZlciA9IHNoZWxsLmV4ZWMoY21kLCB7YXN5bmM6IHRydWV9KVxuXG4gIHNlcnZlci5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgIGlmKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICB9XG4gIH0pXG5cbiAgc2VydmVyLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgaWYob3B0aW9ucy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hUdW5uZWwob3B0aW9ucywgY29udGV4dCkge1xuICB2YXIgc2VydmVyID0gc2hlbGwuZXhlYyhgbmdyb2sgaHR0cCAkeyBvcHRpb25zLnBvcnQgfWAsIHthc3luYzogdHJ1ZX0pXG5cbiAgc2VydmVyLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgaWYoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgIH1cbiAgfSlcblxuICBzZXJ2ZXIuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICBpZihvcHRpb25zLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcGF0aFRvRGV2cGFjayAoKSB7XG4gIHJldHVybiBkaXJuYW1lKFxuICAgIHJlcXVpcmUucmVzb2x2ZSgnc2t5cGFnZXItZGV2cGFjaycpXG4gIClcbn1cblxuZnVuY3Rpb24gaXNEZXBhY2tJbnN0YWxsZWQgKCkge1xuICB0cnkge1xuICAgIHJldHVybiBwYXRoVG9EZXZwYWNrKClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuIl19