'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exporter = exporter;
exports.handle = handle;

var _path = require('path');

var _fs = require('fs');

var _yargs = require('yargs');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exporter(program, dispatch) {
  program.command('export <exporter>').description('run one of the project exporters').option('--output <path>', 'where to save the contents').option('--pretty', 'where to save the contents').option('--format <format>', 'which format should the output be serialized in', 'json').action(dispatch(handle));
}

exports.default = exporter;
function handle(exporterId) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  var exporter = project.registries.exporters.lookup(exporterId, false);

  if (!exporter) {
    abort('could not find and exporter named ' + exporterId);
  }

  var params = Object.assign({}, _yargs.argv, { project: project });

  var payload = project.run.exporter(exporterId, params);
  var output = undefined;

  if (options.format === 'json' && options.pretty) {
    output = JSON.stringify(payload, null, 2);
  } else if (options.format === 'json') {
    output = JSON.stringify(payload);
  } else if (options.format === 'yaml') {
    output = yaml.dump(payload);
  }

  if (options.output) {
    var outputPath = (0, _path.resolve)((0, _path.normalize)(options.output));
    (0, _fs.writeFileSync)(outputPath, output.toString(), 'utf8');
  } else {
    console.log(output);
  }
}

function abort(message) {
  console.log(message.red);
  process.exit(0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvZXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFRZ0IsUUFBUSxHQUFSLFFBQVE7UUFZUixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWmYsU0FBUyxRQUFRLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMzQyxTQUFPLENBQ0osT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQzVCLFdBQVcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUMvQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsNEJBQTRCLENBQUMsQ0FDdkQsTUFBTSxDQUFDLFVBQVUsRUFBRSw0QkFBNEIsQ0FBQyxDQUNoRCxNQUFNLENBQUMsbUJBQW1CLEVBQUUsaURBQWlELEVBQUUsTUFBTSxDQUFDLENBQ3RGLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUM1Qjs7a0JBRWMsUUFBUTtBQUVoQixTQUFTLE1BQU0sQ0FBRSxVQUFVLEVBQThCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTtNQUNwRCxPQUFPLEdBQUssT0FBTyxDQUFuQixPQUFPOztBQUNmLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRXZFLE1BQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixTQUFLLHdDQUF1QyxVQUFVLENBQUksQ0FBQTtHQUMzRDs7QUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsU0F6QnhCLElBQUksRUF5QjRCLEVBQUMsT0FBTyxFQUFQLE9BQU8sRUFBQyxDQUFDLENBQUE7O0FBRWpELE1BQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUN0RCxNQUFJLE1BQU0sWUFBQSxDQUFBOztBQUVWLE1BQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUM5QyxVQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0dBQzNDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUNuQyxVQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNsQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDcEMsVUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDNUI7O0FBRUQsTUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2xCLFFBQUksVUFBVSxHQUFHLFVBMUNOLE9BQU8sRUEwQ08sVUExQ0ksU0FBUyxFQTBDSCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUNuRCxZQTFDSyxhQUFhLEVBMENaLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7R0FDN0MsTUFBTTtBQUNKLFdBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDckI7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDckIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDeEIsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUNqQiIsImZpbGUiOiJleHBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUsIG5vcm1hbGl6ZSwgZXhpc3RzU3luYyBhcyBleGlzdHMgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyBhcyB3cml0ZSwgc3RhdFN5bmMgYXMgc3RhdCB9IGZyb20gJ2ZzJ1xuXG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAneWFyZ3MnXG5cbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRlciAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdleHBvcnQgPGV4cG9ydGVyPicpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gb25lIG9mIHRoZSBwcm9qZWN0IGV4cG9ydGVycycpXG4gICAgLm9wdGlvbignLS1vdXRwdXQgPHBhdGg+JywgJ3doZXJlIHRvIHNhdmUgdGhlIGNvbnRlbnRzJylcbiAgICAub3B0aW9uKCctLXByZXR0eScsICd3aGVyZSB0byBzYXZlIHRoZSBjb250ZW50cycpXG4gICAgLm9wdGlvbignLS1mb3JtYXQgPGZvcm1hdD4nLCAnd2hpY2ggZm9ybWF0IHNob3VsZCB0aGUgb3V0cHV0IGJlIHNlcmlhbGl6ZWQgaW4nLCAnanNvbicpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBleHBvcnRlclxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlIChleHBvcnRlcklkLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zdCB7IHByb2plY3QgfSA9IGNvbnRleHRcbiAgY29uc3QgZXhwb3J0ZXIgPSBwcm9qZWN0LnJlZ2lzdHJpZXMuZXhwb3J0ZXJzLmxvb2t1cChleHBvcnRlcklkLCBmYWxzZSlcblxuICBpZiAoIWV4cG9ydGVyKSB7XG4gICAgYWJvcnQoYGNvdWxkIG5vdCBmaW5kIGFuZCBleHBvcnRlciBuYW1lZCAkeyBleHBvcnRlcklkIH1gKVxuICB9XG5cbiAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgYXJndiwge3Byb2plY3R9KVxuXG4gIGxldCBwYXlsb2FkID0gcHJvamVjdC5ydW4uZXhwb3J0ZXIoZXhwb3J0ZXJJZCwgcGFyYW1zKVxuICBsZXQgb3V0cHV0XG5cbiAgaWYgKG9wdGlvbnMuZm9ybWF0ID09PSAnanNvbicgJiYgb3B0aW9ucy5wcmV0dHkpIHtcbiAgICAgb3V0cHV0ID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMilcbiAgfSBlbHNlIGlmIChvcHRpb25zLmZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgIG91dHB1dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpXG4gIH0gZWxzZSBpZiAob3B0aW9ucy5mb3JtYXQgPT09ICd5YW1sJykge1xuICAgIG91dHB1dCA9IHlhbWwuZHVtcChwYXlsb2FkKVxuICB9XG5cbiAgaWYgKG9wdGlvbnMub3V0cHV0KSB7XG4gICAgbGV0IG91dHB1dFBhdGggPSByZXNvbHZlKG5vcm1hbGl6ZShvcHRpb25zLm91dHB1dCkpXG4gICAgd3JpdGUob3V0cHV0UGF0aCwgb3V0cHV0LnRvU3RyaW5nKCksICd1dGY4JylcbiAgfSBlbHNlIHtcbiAgICAgY29uc29sZS5sb2cob3V0cHV0KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFib3J0KG1lc3NhZ2UpIHtcbiAgIGNvbnNvbGUubG9nKG1lc3NhZ2UucmVkKVxuICAgcHJvY2Vzcy5leGl0KDApXG59XG4iXX0=