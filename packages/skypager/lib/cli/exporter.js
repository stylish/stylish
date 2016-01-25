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
  program.command('export <exporter>').description('run one of the project exporters').option('--format <format>', 'which format should the output be serialized in', 'json').option('--output <path>', 'where to save the contents').option('--pretty', 'pretty print the output').option('--stdout', 'write output to stdout').action(dispatch(handle));
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
  var extname = options.format;

  // declare this on the exporter somehow
  if (exporterId === 'bundle') {
    extname = 'js';
  }

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
  } else if (options.stdout) {
    console.log(output);
  } else if (exporterId === 'bundle') {
    var outputPath = project.path('build', 'bundle.js');
    (0, _fs.writeFileSync)(outputPath, 'module.exports = require(\'./bundle/index\');', 'utf8');
    console.log('Saved exporter to ' + outputPath);
  }
}

function abort(message) {
  console.log(message.red);
  process.exit(0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvZXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFRZ0IsUUFBUSxHQUFSLFFBQVE7UUFhUixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYmYsU0FBUyxRQUFRLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMzQyxTQUFPLENBQ0osT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQzVCLFdBQVcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUMvQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsaURBQWlELEVBQUUsTUFBTSxDQUFDLENBQ3RGLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSw0QkFBNEIsQ0FBQyxDQUN2RCxNQUFNLENBQUMsVUFBVSxFQUFFLHlCQUF5QixDQUFDLENBQzdDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLENBQUMsQ0FDNUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxRQUFRO0FBRWhCLFNBQVMsTUFBTSxDQUFFLFVBQVUsRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFO01BQ3BELE9BQU8sR0FBSyxPQUFPLENBQW5CLE9BQU87O0FBQ2YsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQTs7QUFFdkUsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLFNBQUssd0NBQXVDLFVBQVUsQ0FBSSxDQUFBO0dBQzNEOztBQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQTFCeEIsSUFBSSxFQTBCNEIsRUFBQyxPQUFPLEVBQVAsT0FBTyxFQUFDLENBQUMsQ0FBQTs7QUFFakQsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3RELE1BQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNOzs7QUFBQSxBQUc1QixNQUFJLFVBQVUsS0FBSyxRQUFRLEVBQUU7QUFDM0IsV0FBTyxHQUFHLElBQUksQ0FBQTtHQUNmOztBQUVELE1BQUksTUFBTSxZQUFBLENBQUE7O0FBRVYsTUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzlDLFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDM0MsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQ25DLFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ2xDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUNwQyxVQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUM1Qjs7QUFFRCxNQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsUUFBSSxVQUFVLEdBQUcsVUFsRE4sT0FBTyxFQWtETyxVQWxESSxTQUFTLEVBa0RILE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQ25ELFlBbERLLGFBQWEsRUFrRFosVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtHQUM3QyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUN4QixXQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQ3JCLE1BQU0sSUFBSSxVQUFVLEtBQUssUUFBUSxFQUFFO0FBQ2xDLFFBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ25ELFlBdkRLLGFBQWEsRUF1RFosVUFBVSxtREFBa0QsTUFBTSxDQUFDLENBQUE7QUFDekUsV0FBTyxDQUFDLEdBQUcsd0JBQXVCLFVBQVUsQ0FBSSxDQUFBO0dBQ2pEO0NBQ0Y7O0FBRUQsU0FBUyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3JCLFNBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3hCLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDakIiLCJmaWxlIjoiZXhwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCByZXNvbHZlLCBkaXJuYW1lLCBub3JtYWxpemUsIGV4aXN0c1N5bmMgYXMgZXhpc3RzIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IHdyaXRlRmlsZVN5bmMgYXMgd3JpdGUsIHN0YXRTeW5jIGFzIHN0YXQgfSBmcm9tICdmcydcblxuaW1wb3J0IHsgYXJndiB9IGZyb20gJ3lhcmdzJ1xuXG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJ1xuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0ZXIgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnZXhwb3J0IDxleHBvcnRlcj4nKVxuICAgIC5kZXNjcmlwdGlvbigncnVuIG9uZSBvZiB0aGUgcHJvamVjdCBleHBvcnRlcnMnKVxuICAgIC5vcHRpb24oJy0tZm9ybWF0IDxmb3JtYXQ+JywgJ3doaWNoIGZvcm1hdCBzaG91bGQgdGhlIG91dHB1dCBiZSBzZXJpYWxpemVkIGluJywgJ2pzb24nKVxuICAgIC5vcHRpb24oJy0tb3V0cHV0IDxwYXRoPicsICd3aGVyZSB0byBzYXZlIHRoZSBjb250ZW50cycpXG4gICAgLm9wdGlvbignLS1wcmV0dHknLCAncHJldHR5IHByaW50IHRoZSBvdXRwdXQnKVxuICAgIC5vcHRpb24oJy0tc3Rkb3V0JywgJ3dyaXRlIG91dHB1dCB0byBzdGRvdXQnKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0ZXJcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSAoZXhwb3J0ZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc3QgeyBwcm9qZWN0IH0gPSBjb250ZXh0XG4gIGNvbnN0IGV4cG9ydGVyID0gcHJvamVjdC5yZWdpc3RyaWVzLmV4cG9ydGVycy5sb29rdXAoZXhwb3J0ZXJJZCwgZmFsc2UpXG5cbiAgaWYgKCFleHBvcnRlcikge1xuICAgIGFib3J0KGBjb3VsZCBub3QgZmluZCBhbmQgZXhwb3J0ZXIgbmFtZWQgJHsgZXhwb3J0ZXJJZCB9YClcbiAgfVxuXG4gIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGFyZ3YsIHtwcm9qZWN0fSlcblxuICBsZXQgcGF5bG9hZCA9IHByb2plY3QucnVuLmV4cG9ydGVyKGV4cG9ydGVySWQsIHBhcmFtcylcbiAgbGV0IGV4dG5hbWUgPSBvcHRpb25zLmZvcm1hdFxuXG4gIC8vIGRlY2xhcmUgdGhpcyBvbiB0aGUgZXhwb3J0ZXIgc29tZWhvd1xuICBpZiAoZXhwb3J0ZXJJZCA9PT0gJ2J1bmRsZScpIHtcbiAgICBleHRuYW1lID0gJ2pzJ1xuICB9XG5cbiAgbGV0IG91dHB1dFxuXG4gIGlmIChvcHRpb25zLmZvcm1hdCA9PT0gJ2pzb24nICYmIG9wdGlvbnMucHJldHR5KSB7XG4gICAgIG91dHB1dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIDIpXG4gIH0gZWxzZSBpZiAob3B0aW9ucy5mb3JtYXQgPT09ICdqc29uJykge1xuICAgICBvdXRwdXQgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkKVxuICB9IGVsc2UgaWYgKG9wdGlvbnMuZm9ybWF0ID09PSAneWFtbCcpIHtcbiAgICBvdXRwdXQgPSB5YW1sLmR1bXAocGF5bG9hZClcbiAgfVxuXG4gIGlmIChvcHRpb25zLm91dHB1dCkge1xuICAgIGxldCBvdXRwdXRQYXRoID0gcmVzb2x2ZShub3JtYWxpemUob3B0aW9ucy5vdXRwdXQpKVxuICAgIHdyaXRlKG91dHB1dFBhdGgsIG91dHB1dC50b1N0cmluZygpLCAndXRmOCcpXG4gIH0gZWxzZSBpZiAob3B0aW9ucy5zdGRvdXQpIHtcbiAgICAgY29uc29sZS5sb2cob3V0cHV0KVxuICB9IGVsc2UgaWYgKGV4cG9ydGVySWQgPT09ICdidW5kbGUnKSB7XG4gICAgbGV0IG91dHB1dFBhdGggPSBwcm9qZWN0LnBhdGgoJ2J1aWxkJywgJ2J1bmRsZS5qcycpXG4gICAgd3JpdGUob3V0cHV0UGF0aCwgIGBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnVuZGxlL2luZGV4Jyk7YCwgJ3V0ZjgnKVxuICAgIGNvbnNvbGUubG9nKGBTYXZlZCBleHBvcnRlciB0byAkeyBvdXRwdXRQYXRoIH1gKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFib3J0KG1lc3NhZ2UpIHtcbiAgIGNvbnNvbGUubG9nKG1lc3NhZ2UucmVkKVxuICAgcHJvY2Vzcy5leGl0KDApXG59XG4iXX0=