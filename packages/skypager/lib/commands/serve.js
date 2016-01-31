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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUtnQixLQUFLLEdBQUwsS0FBSztRQVlMLE1BQU0sR0FBTixNQUFNOzs7Ozs7Ozs7Ozs7OztBQVpmLFNBQVMsS0FBSyxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDeEMsU0FBTyxDQUNKLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FDaEIsTUFBTSxDQUFDLGVBQWUsRUFBRSxtREFBbUQsRUFBRSxJQUFJLENBQUMsQ0FDbEYsTUFBTSxDQUFDLG1CQUFtQixFQUFFLHVDQUF1QyxFQUFFLFdBQVcsQ0FBQyxDQUNqRixNQUFNLENBQUMsVUFBVSxFQUFFLGlFQUFpRSxDQUFDLENBQ3JGLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSw4Q0FBOEMsQ0FBQyxDQUNoRixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDNUI7O2tCQUVjLEtBQUs7QUFFYixTQUFTLE1BQU0sR0FBNkI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUMvQyxTQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUE7Q0FDckMiLCJmaWxlIjoic2VydmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCBkaXJuYW1lIH0gZnJvbSAncGF0aCdcblxuaW1wb3J0IHNoZWxsIGZyb20gJ3NoZWxsanMnXG5pbXBvcnQgdXRpbCBmcm9tICcuLi91dGlsJ1xuXG5leHBvcnQgZnVuY3Rpb24gc2VydmUgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnc2VydmUnKVxuICAgIC5vcHRpb24oJy0tcG9ydCA8cG9ydD4nLCAnd2hpY2ggcG9ydD8gc3BlY2lmeSBhbnkgdG8gdXNlIGFueSBhdmFpbGFibGUgcG9ydCcsIDMwMDApXG4gICAgLm9wdGlvbignLS1ob3N0IDxob3N0bmFtZT4nLCAnd2hpY2ggaG9zdG5hbWU/IGRlZmF1bHRzIHRvIGxvY2FsaG9zdCcsICdsb2NhbGhvc3QnKVxuICAgIC5vcHRpb24oJy0tZXhwb3NlJywgJ3doZW4gZW5hYmxlZCwgd2lsbCBleHBvc2UgdGhpcyBzZXJ2ZXIgdG8gdGhlIHB1YmxpYyB1c2luZyBuZ3JvaycpXG4gICAgLm9wdGlvbignLS1leHBvc2UtY29uZmlnIDxwYXRoPicsICdwYXRoIHRvIGEgY29uZmlnIGZpbGUgZm9yIHRoZSBleHBvc2Ugc2VydmljZScpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnNvbGUubG9nKCdUT0RPIGhhbmRsZSBzZXJ2ZSBDTEknKVxufVxuXG4iXX0=