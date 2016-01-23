'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.handle = handle;
function init(program, dispatch) {
  program.command('init <projectName>').description('create a new skypager project').option('--plugins <list>', 'a comma separated list of plugins to use', list).action(dispatch(handle));
}

function handle(projectName) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
}

exports.default = init;

function list(val) {
  return ('' + val).split(',').map(function (val) {
    return val.toLowerCase().replace(/^\s+|\s+$/, '');
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUFnQixJQUFJLEdBQUosSUFBSTtRQVFKLE1BQU0sR0FBTixNQUFNO0FBUmYsU0FBUyxJQUFJLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN2QyxTQUFPLENBQ0osT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQzdCLFdBQVcsQ0FBQywrQkFBK0IsQ0FBQyxDQUM1QyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsMENBQTBDLEVBQUUsSUFBSSxDQUFDLENBQzVFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUM1Qjs7QUFFTSxTQUFTLE1BQU0sQ0FBRSxXQUFXLEVBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFO0NBRWhEOztrQkFFYyxJQUFJOztBQUVuQixTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDakIsU0FBTyxNQUFJLEdBQUcsRUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRztXQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFDLEVBQUUsQ0FBQztHQUFBLENBQUMsQ0FBQTtDQUNuRiIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGluaXQgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnaW5pdCA8cHJvamVjdE5hbWU+JylcbiAgICAuZGVzY3JpcHRpb24oJ2NyZWF0ZSBhIG5ldyBza3lwYWdlciBwcm9qZWN0JylcbiAgICAub3B0aW9uKCctLXBsdWdpbnMgPGxpc3Q+JywgJ2EgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgcGx1Z2lucyB0byB1c2UnLCBsaXN0KVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSAocHJvamVjdE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRcblxuZnVuY3Rpb24gbGlzdCh2YWwpIHtcbiAgcmV0dXJuIGAkeyB2YWwgfWAuc3BsaXQoJywnKS5tYXAodmFsID0+IHZhbC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL15cXHMrfFxccyskLywnJykpXG59XG4iXX0=