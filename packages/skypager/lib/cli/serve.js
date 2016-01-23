'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serve = serve;
exports.handle = handle;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serve(program, dispatch) {
  program.command('serve').option('--port <port>', 'which port? specify any to use any available port', 3000).option('--host <hostname>', 'which hostname? defaults to localhost', 'localhost').option('--expose', 'when enabled, will expose this server to the public using ngrok').option('--expose-config <path>', 'path to a config file for the expose service').action(dispatch(handle));
}

exports.default = serve;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log('TODO handle serve CLI');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc2VydmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFLZ0IsS0FBSyxHQUFMLEtBQUs7UUFZTCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7QUFaZixTQUFTLEtBQUssQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3hDLFNBQU8sQ0FDSixPQUFPLENBQUMsT0FBTyxDQUFDLENBQ2hCLE1BQU0sQ0FBQyxlQUFlLEVBQUUsbURBQW1ELEVBQUUsSUFBSSxDQUFDLENBQ2xGLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSx1Q0FBdUMsRUFBRSxXQUFXLENBQUMsQ0FDakYsTUFBTSxDQUFDLFVBQVUsRUFBRSxpRUFBaUUsQ0FBQyxDQUNyRixNQUFNLENBQUMsd0JBQXdCLEVBQUUsOENBQThDLENBQUMsQ0FDaEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxLQUFLO0FBRWIsU0FBUyxNQUFNLEdBQTZCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDL0MsU0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0NBQ3JDIiwiZmlsZSI6InNlcnZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgam9pbiwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbGpzJ1xuaW1wb3J0IHV0aWwgZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ3NlcnZlJylcbiAgICAub3B0aW9uKCctLXBvcnQgPHBvcnQ+JywgJ3doaWNoIHBvcnQ/IHNwZWNpZnkgYW55IHRvIHVzZSBhbnkgYXZhaWxhYmxlIHBvcnQnLCAzMDAwKVxuICAgIC5vcHRpb24oJy0taG9zdCA8aG9zdG5hbWU+JywgJ3doaWNoIGhvc3RuYW1lPyBkZWZhdWx0cyB0byBsb2NhbGhvc3QnLCAnbG9jYWxob3N0JylcbiAgICAub3B0aW9uKCctLWV4cG9zZScsICd3aGVuIGVuYWJsZWQsIHdpbGwgZXhwb3NlIHRoaXMgc2VydmVyIHRvIHRoZSBwdWJsaWMgdXNpbmcgbmdyb2snKVxuICAgIC5vcHRpb24oJy0tZXhwb3NlLWNvbmZpZyA8cGF0aD4nLCAncGF0aCB0byBhIGNvbmZpZyBmaWxlIGZvciB0aGUgZXhwb3NlIHNlcnZpY2UnKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VydmVcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZShvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zb2xlLmxvZygnVE9ETyBoYW5kbGUgc2VydmUgQ0xJJylcbn1cblxuIl19