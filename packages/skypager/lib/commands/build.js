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
  program.command('build [entry]').description('build a website for this project using our preconfigured webpack bundle').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--entry-only', 'only compiled asssets; do not use html template').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--external-vendors', "assume vendor libraries will be available to our script").option('--no-vendor-libraries', "don't include any vendor libraries in the bundle").option('--theme <name>', 'the name of the theme to use', 'dashboard').option('--output-folder <path>', 'relative path to the output folder', 'public').option('--html-filename <filename>', 'what should we name the html file?', 'index.html').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--push-state', 'use a 200.html file to support push state').option('--content-hash', 'fingerprint the names of the files as a cache busting mechanism', true).option('--no-content-hash', 'fingerprint the names of the files as a cache busting mechanism', true).option('--dev-tools-path <path>', 'path to the skypager-devpack').option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config').option('--export-library <name>', 'build this as a umd library').option('--modules-path <path>', 'which modules folder to use for webpacks default? defaults to standard node_modules').option('--dist-path <path>', 'the project exporter or dist path').option('--skip-theme', 'do not include any skypager-theme content').option('--feature-flags <path>', 'path to a script which exports an object to be used for feature flags').option('--bundle', 'watch for content changes in the project and update the distribution bundle').option('--bundle-command', 'the command to run to generate the bundle default: skypager export bundle', 'skypager export bundle').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').option('--template-inject [target]', 'where to inject the webpack bundle? none, body, head').action(dispatch(handle));
}

exports.default = build;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  entry = entry || options.entry;
  options.theme = options.theme || project.options.theme;

  if (!options.theme && !options.skipTheme) {
    console.log('Are you sure you want to run without a theme?'.yellow);
  }

  process.env.NODE_ENV = 'production';

  var bundleCommand = options.bundleCommand || 'skypager export bundle';

  console.log('Exporting project bundle'.green);
  _shelljs2.default.exec(bundleCommand + ' --clean');

  require(pathToDevpack(options.devToolsPath) + '/webpack/compiler')(options);
}

function pathToDevpack(opt) {
  return opt && resolve(opt) || process.env.SKYPAGER_DEVPACK_PATH || (0, _path.dirname)(require.resolve('skypager-devpack'));
}

function isDepackInstalled() {
  try {
    return pathToDevpack();
  } catch (error) {
    return false;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9idWlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUtnQixLQUFLLEdBQUwsS0FBSztRQW1DTCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7QUFuQ2YsU0FBUyxLQUFLLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN4QyxTQUFPLENBQ0osT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUN4QixXQUFXLENBQUMseUVBQXlFLENBQUMsQ0FDdEYsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGtDQUFrQyxFQUFFLE9BQU8sQ0FBQyxDQUNyRSxNQUFNLENBQUMscUJBQXFCLEVBQUUscUNBQXFDLEVBQUUsS0FBSyxDQUFDLENBQzNFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsaURBQWlELENBQUMsQ0FDekUsTUFBTSxDQUFDLG1CQUFtQixFQUFFLHFEQUFxRCxFQUFFLEtBQUssQ0FBQyxDQUN6RixNQUFNLENBQUMsb0JBQW9CLEVBQUUseURBQXlELENBQUMsQ0FDdkYsTUFBTSxDQUFDLHVCQUF1QixFQUFFLGtEQUFrRCxDQUFDLENBQ25GLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSw4QkFBOEIsRUFBRSxXQUFXLENBQUMsQ0FDckUsTUFBTSxDQUFDLHdCQUF3QixFQUFFLG9DQUFvQyxFQUFFLFFBQVEsQ0FBQyxDQUNoRixNQUFNLENBQUMsNEJBQTRCLEVBQUUsb0NBQW9DLEVBQUUsWUFBWSxDQUFDLENBQ3hGLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUN6RSxNQUFNLENBQUMsc0JBQXNCLEVBQUUseUVBQXlFLENBQUMsQ0FDekcsTUFBTSxDQUFDLGNBQWMsRUFBRSwyQ0FBMkMsQ0FBQyxDQUNuRSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsaUVBQWlFLEVBQUUsSUFBSSxDQUFDLENBQ2pHLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxpRUFBaUUsRUFBRSxJQUFJLENBQUMsQ0FDcEcsTUFBTSxDQUFDLHlCQUF5QixFQUFFLDhCQUE4QixDQUFDLENBQ2pFLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxtRUFBbUUsQ0FBQyxDQUN0RyxNQUFNLENBQUMseUJBQXlCLEVBQUUsNkJBQTZCLENBQUMsQ0FDaEUsTUFBTSxDQUFDLHVCQUF1QixFQUFFLHFGQUFxRixDQUFDLENBQ3RILE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxtQ0FBbUMsQ0FBQyxDQUNqRSxNQUFNLENBQUMsY0FBYyxFQUFFLDJDQUEyQyxDQUFDLENBQ25FLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSx1RUFBdUUsQ0FBQyxDQUN6RyxNQUFNLENBQUMsVUFBVSxFQUFFLDZFQUE2RSxDQUFDLENBQ2pHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSwyRUFBMkUsRUFBRSx3QkFBd0IsQ0FBQyxDQUNqSSxNQUFNLENBQUMsVUFBVSxFQUFFLDRCQUE0QixDQUFDLENBQ2hELE1BQU0sQ0FBQyxTQUFTLEVBQUUsaUNBQWlDLENBQUMsQ0FDcEQsTUFBTSxDQUFDLDRCQUE0QixFQUFFLHNEQUFzRCxDQUFDLENBQzVGLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUM1Qjs7a0JBRWMsS0FBSztBQUViLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUN0RCxPQUFLLEdBQUcsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUE7QUFDOUIsU0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFBOztBQUV0RCxNQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7QUFDeEMsV0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNwRTs7QUFFRCxTQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUE7O0FBRW5DLE1BQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLElBQUksd0JBQXdCLENBQUE7O0FBRXJFLFNBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDN0Msb0JBQU0sSUFBSSxDQUFLLGFBQWEsY0FBWSxDQUFBOztBQUV4QyxTQUFPLENBQUssYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsdUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUE7Q0FDOUU7O0FBR0QsU0FBUyxhQUFhLENBQUUsR0FBRyxFQUFFO0FBQUUsU0FBTyxBQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxVQTNEckYsT0FBTyxFQTJEdUYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7Q0FBRTs7QUFFbkosU0FBUyxpQkFBaUIsR0FBSTtBQUM1QixNQUFJO0FBQ0YsV0FBTyxhQUFhLEVBQUUsQ0FBQTtHQUN2QixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsV0FBTyxLQUFLLENBQUE7R0FDYjtDQUNGIiwiZmlsZSI6ImJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgam9pbiwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbGpzJ1xuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2J1aWxkIFtlbnRyeV0nKVxuICAgIC5kZXNjcmlwdGlvbignYnVpbGQgYSB3ZWJzaXRlIGZvciB0aGlzIHByb2plY3QgdXNpbmcgb3VyIHByZWNvbmZpZ3VyZWQgd2VicGFjayBidW5kbGUnKVxuICAgIC5vcHRpb24oJy0tZW50cnkgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIGVudHJ5IHBvaW50JywgJy4vc3JjJylcbiAgICAub3B0aW9uKCctLWVudHJ5LW5hbWUgPG5hbWU+JywgJ3doYXQgdG8gbmFtZSB0aGUgZW50cnkgcG9pbnQgc2NyaXB0JywgJ2FwcCcpXG4gICAgLm9wdGlvbignLS1lbnRyeS1vbmx5JywgJ29ubHkgY29tcGlsZWQgYXNzc2V0czsgZG8gbm90IHVzZSBodG1sIHRlbXBsYXRlJylcbiAgICAub3B0aW9uKCctLXBsYXRmb3JtIDxuYW1lPicsICd3aGljaCBwbGF0Zm9ybSBhcmUgd2UgYnVpbGRpbmcgZm9yPyBlbGVjdHJvbiBvciB3ZWInLCAnd2ViJylcbiAgICAub3B0aW9uKCctLWV4dGVybmFsLXZlbmRvcnMnLCBcImFzc3VtZSB2ZW5kb3IgbGlicmFyaWVzIHdpbGwgYmUgYXZhaWxhYmxlIHRvIG91ciBzY3JpcHRcIilcbiAgICAub3B0aW9uKCctLW5vLXZlbmRvci1saWJyYXJpZXMnLCBcImRvbid0IGluY2x1ZGUgYW55IHZlbmRvciBsaWJyYXJpZXMgaW4gdGhlIGJ1bmRsZVwiKVxuICAgIC5vcHRpb24oJy0tdGhlbWUgPG5hbWU+JywgJ3RoZSBuYW1lIG9mIHRoZSB0aGVtZSB0byB1c2UnLCAnZGFzaGJvYXJkJylcbiAgICAub3B0aW9uKCctLW91dHB1dC1mb2xkZXIgPHBhdGg+JywgJ3JlbGF0aXZlIHBhdGggdG8gdGhlIG91dHB1dCBmb2xkZXInLCAncHVibGljJylcbiAgICAub3B0aW9uKCctLWh0bWwtZmlsZW5hbWUgPGZpbGVuYW1lPicsICd3aGF0IHNob3VsZCB3ZSBuYW1lIHRoZSBodG1sIGZpbGU/JywgJ2luZGV4Lmh0bWwnKVxuICAgIC5vcHRpb24oJy0taHRtbC10ZW1wbGF0ZS1wYXRoIDxwYXRoPicsICdwYXRoIHRvIHRoZSBodG1sIHRlbXBsYXRlIHRvIHVzZScpXG4gICAgLm9wdGlvbignLS1wcmVjb21waWxlZCA8bmFtZT4nLCAndXNlIGEgcHJlY29tcGlsZWQgaHRtbCB0ZW1wbGF0ZSB3aGljaCBpbmNsdWRlcyB2ZW5kb3IgbGlicywgdGhlbWVzLCBldGMnKVxuICAgIC5vcHRpb24oJy0tcHVzaC1zdGF0ZScsICd1c2UgYSAyMDAuaHRtbCBmaWxlIHRvIHN1cHBvcnQgcHVzaCBzdGF0ZScpXG4gICAgLm9wdGlvbignLS1jb250ZW50LWhhc2gnLCAnZmluZ2VycHJpbnQgdGhlIG5hbWVzIG9mIHRoZSBmaWxlcyBhcyBhIGNhY2hlIGJ1c3RpbmcgbWVjaGFuaXNtJywgdHJ1ZSlcbiAgICAub3B0aW9uKCctLW5vLWNvbnRlbnQtaGFzaCcsICdmaW5nZXJwcmludCB0aGUgbmFtZXMgb2YgdGhlIGZpbGVzIGFzIGEgY2FjaGUgYnVzdGluZyBtZWNoYW5pc20nLCB0cnVlKVxuICAgIC5vcHRpb24oJy0tZGV2LXRvb2xzLXBhdGggPHBhdGg+JywgJ3BhdGggdG8gdGhlIHNreXBhZ2VyLWRldnBhY2snKVxuICAgIC5vcHRpb24oJy0td2VicGFjay1jb25maWcgPHBhdGg+JywgJ3BhdGggdG8gYSBqYXZhc2NyaXB0IGZ1bmN0aW9uIHdoaWNoIGNhbiBtdXRhdGUgdGhlIHdlYnBhY2sgY29uZmlnJylcbiAgICAub3B0aW9uKCctLWV4cG9ydC1saWJyYXJ5IDxuYW1lPicsICdidWlsZCB0aGlzIGFzIGEgdW1kIGxpYnJhcnknKVxuICAgIC5vcHRpb24oJy0tbW9kdWxlcy1wYXRoIDxwYXRoPicsICd3aGljaCBtb2R1bGVzIGZvbGRlciB0byB1c2UgZm9yIHdlYnBhY2tzIGRlZmF1bHQ/IGRlZmF1bHRzIHRvIHN0YW5kYXJkIG5vZGVfbW9kdWxlcycpXG4gICAgLm9wdGlvbignLS1kaXN0LXBhdGggPHBhdGg+JywgJ3RoZSBwcm9qZWN0IGV4cG9ydGVyIG9yIGRpc3QgcGF0aCcpXG4gICAgLm9wdGlvbignLS1za2lwLXRoZW1lJywgJ2RvIG5vdCBpbmNsdWRlIGFueSBza3lwYWdlci10aGVtZSBjb250ZW50JylcbiAgICAub3B0aW9uKCctLWZlYXR1cmUtZmxhZ3MgPHBhdGg+JywgJ3BhdGggdG8gYSBzY3JpcHQgd2hpY2ggZXhwb3J0cyBhbiBvYmplY3QgdG8gYmUgdXNlZCBmb3IgZmVhdHVyZSBmbGFncycpXG4gICAgLm9wdGlvbignLS1idW5kbGUnLCAnd2F0Y2ggZm9yIGNvbnRlbnQgY2hhbmdlcyBpbiB0aGUgcHJvamVjdCBhbmQgdXBkYXRlIHRoZSBkaXN0cmlidXRpb24gYnVuZGxlJylcbiAgICAub3B0aW9uKCctLWJ1bmRsZS1jb21tYW5kJywgJ3RoZSBjb21tYW5kIHRvIHJ1biB0byBnZW5lcmF0ZSB0aGUgYnVuZGxlIGRlZmF1bHQ6IHNreXBhZ2VyIGV4cG9ydCBidW5kbGUnLCAnc2t5cGFnZXIgZXhwb3J0IGJ1bmRsZScpXG4gICAgLm9wdGlvbignLS1zaWxlbnQnLCAnc3VwcHJlc3MgYW55IHNlcnZlciBvdXRwdXQnKVxuICAgIC5vcHRpb24oJy0tZGVidWcnLCAnc2hvdyBlcnJvciBpbmZvIGZyb20gdGhlIHNlcnZlcicpXG4gICAgLm9wdGlvbignLS10ZW1wbGF0ZS1pbmplY3QgW3RhcmdldF0nLCAnd2hlcmUgdG8gaW5qZWN0IHRoZSB3ZWJwYWNrIGJ1bmRsZT8gbm9uZSwgYm9keSwgaGVhZCcpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKGVudHJ5LCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBlbnRyeSA9IGVudHJ5IHx8IG9wdGlvbnMuZW50cnlcbiAgb3B0aW9ucy50aGVtZSA9IG9wdGlvbnMudGhlbWUgfHwgcHJvamVjdC5vcHRpb25zLnRoZW1lXG5cbiAgaWYgKCFvcHRpb25zLnRoZW1lICYmICFvcHRpb25zLnNraXBUaGVtZSkge1xuICAgIGNvbnNvbGUubG9nKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcnVuIHdpdGhvdXQgYSB0aGVtZT8nLnllbGxvdylcbiAgfVxuXG4gIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gJ3Byb2R1Y3Rpb24nXG5cbiAgbGV0IGJ1bmRsZUNvbW1hbmQgPSBvcHRpb25zLmJ1bmRsZUNvbW1hbmQgfHwgJ3NreXBhZ2VyIGV4cG9ydCBidW5kbGUnXG5cbiAgY29uc29sZS5sb2coJ0V4cG9ydGluZyBwcm9qZWN0IGJ1bmRsZScuZ3JlZW4pXG4gIHNoZWxsLmV4ZWMoYCR7IGJ1bmRsZUNvbW1hbmQgfSAtLWNsZWFuYClcblxuICByZXF1aXJlKGAkeyBwYXRoVG9EZXZwYWNrKG9wdGlvbnMuZGV2VG9vbHNQYXRoKSB9L3dlYnBhY2svY29tcGlsZXJgKShvcHRpb25zKVxufVxuXG5cbmZ1bmN0aW9uIHBhdGhUb0RldnBhY2sgKG9wdCkgeyByZXR1cm4gKG9wdCAmJiByZXNvbHZlKG9wdCkpIHx8IHByb2Nlc3MuZW52LlNLWVBBR0VSX0RFVlBBQ0tfUEFUSCB8fCBkaXJuYW1lKCByZXF1aXJlLnJlc29sdmUoJ3NreXBhZ2VyLWRldnBhY2snKSkgfVxuXG5mdW5jdGlvbiBpc0RlcGFja0luc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhdGhUb0RldnBhY2soKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=