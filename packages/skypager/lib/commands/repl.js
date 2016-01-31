'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repl = repl;
exports.handle = handle;
function repl(program, dispatch) {
  program.command('console').option('--es6', 'require babel-register and polyfill').action(dispatch(handle));
}

exports.default = repl;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var replServer = require('repl').start({
    prompt: 'skypager'.magenta + ':'.cyan + ' '
  });

  Object.keys(context).forEach(function (key) {
    replServer.context[key] = context[key];
    replServer.context.keys = Object.keys(context);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9yZXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLElBQUksR0FBSixJQUFJO1FBU0osTUFBTSxHQUFOLE1BQU07QUFUZixTQUFTLElBQUksQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3ZDLFNBQU8sQ0FDSixPQUFPLENBQUMsU0FBUyxDQUFDLENBQ2xCLE1BQU0sQ0FBQyxPQUFPLEVBQUUscUNBQXFDLENBQUMsQ0FDdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxJQUFJO0FBRVosU0FBUyxNQUFNLEdBQThCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDaEQsTUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNyQyxVQUFNLEVBQUcsVUFBVSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQUFBQztHQUM5QyxDQUFDLENBQUE7O0FBRUYsUUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDbEMsY0FBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDdEMsY0FBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUMvQyxDQUFDLENBQUE7Q0FDSCIsImZpbGUiOiJyZXBsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJlcGwgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnY29uc29sZScpXG4gICAgLm9wdGlvbignLS1lczYnLCAncmVxdWlyZSBiYWJlbC1yZWdpc3RlciBhbmQgcG9seWZpbGwnKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVwbFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlIChvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICB2YXIgcmVwbFNlcnZlciA9IHJlcXVpcmUoJ3JlcGwnKS5zdGFydCh7XG4gICAgcHJvbXB0OiAoJ3NreXBhZ2VyJy5tYWdlbnRhICsgJzonLmN5YW4gKyAnICcpXG4gIH0pXG5cbiAgT2JqZWN0LmtleXMoY29udGV4dCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIHJlcGxTZXJ2ZXIuY29udGV4dFtrZXldID0gY29udGV4dFtrZXldXG4gICAgcmVwbFNlcnZlci5jb250ZXh0LmtleXMgPSBPYmplY3Qua2V5cyhjb250ZXh0KVxuICB9KVxufVxuIl19