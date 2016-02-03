'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.author = author;
exports.handle = handle;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function author(program, dispatch) {
  program.command('author [workspace]').option('--main <require>', 'require this script in the electron main process').option('--project <path>', 'the project path').option('--interactive', 'run an interactive REPL').option('--dont-boot', 'dont boot the electron app (DEV HELPER)').description('run an author workspace app').action(dispatch(handle));
}

exports.default = author;
function handle(workspace) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  var electron = isElectronInstalled();
  var skypagerElectron = isSkypagerElectronInstalled();

  if (!electron) {
    abort('make sure electron-prebuilt is available.  You can specify a path manually via the ELECTRON_PREBUILT_PATH env var');
  }

  if (!skypagerElectron) {
    abort('Make sure the skypager-electron package is available. You can specify a path manually via the SKYPAGER_ELECTRON_PATH env var');
  }

  var authorArgs = process.argv.slice(2);

  if (project) {
    authorArgs.push('--project', project.root);
  }

  var proc = require('child_process').spawn(electron, [skypagerElectron].concat(authorArgs));

  proc.stdout.on('data', function (data) {
    return console.log(data.toString());
  });
  proc.stderr.on('data', function (data) {
    return console.log(data.toString());
  });
}

function isSkypagerElectronInstalled() {
  try {
    return require('path').dirname(require.resolve('skypager-electron'));
  } catch (error) {
    return false;
  }
}

function isElectronInstalled() {
  try {
    return require('electron-prebuilt');
  } catch (error) {
    return false;
  }
}

function abort(msg) {
  var _console;

  console.log();
  console.log(('' + msg).red);

  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  (_console = console).log.apply(_console, rest);
  process.exit(1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdXRob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJZ0IsTUFBTSxHQUFOLE1BQU07UUFhTixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7O0FBYmYsU0FBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QyxTQUFPLENBQ0osT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQzdCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxrREFBa0QsQ0FBQyxDQUM5RSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FDOUMsTUFBTSxDQUFDLGVBQWUsRUFBRSx5QkFBeUIsQ0FBQyxDQUNsRCxNQUFNLENBQUMsYUFBYSxFQUFFLHlDQUF5QyxDQUFDLENBQ2hFLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUMxQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDNUI7O2tCQUVjLE1BQU07QUFFZCxTQUFTLE1BQU0sQ0FBQyxTQUFTLEVBQThCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTtNQUNwRCxPQUFPLEdBQUssT0FBTyxDQUFuQixPQUFPOztBQUViLE1BQUksUUFBUSxHQUFHLG1CQUFtQixFQUFFLENBQUE7QUFDcEMsTUFBSSxnQkFBZ0IsR0FBRywyQkFBMkIsRUFBRSxDQUFBOztBQUVwRCxNQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsU0FBSyxDQUFDLG1IQUFtSCxDQUFDLENBQUE7R0FDM0g7O0FBRUQsTUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQ3JCLFNBQUssQ0FBQyw4SEFBOEgsQ0FBQyxDQUFBO0dBQ3RJOztBQUVELE1BQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV0QyxNQUFJLE9BQU8sRUFBRTtBQUNYLGNBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUMzQzs7QUFFRCxNQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUN2QyxRQUFRLEVBQ1IsQ0FBRSxnQkFBZ0IsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FDeEMsQ0FBQzs7QUFFRixNQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJO1dBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7R0FBQSxDQUFDLENBQUE7QUFDOUQsTUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSTtXQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQUEsQ0FBQyxDQUFBO0NBQy9EOztBQUVELFNBQVMsMkJBQTJCLEdBQUk7QUFDdEMsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtHQUNyRSxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2IsV0FBTyxLQUFLLENBQUE7R0FDZDtDQUNGOztBQUVELFNBQVMsbUJBQW1CLEdBQUk7QUFDOUIsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7R0FDcEMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFdBQU8sS0FBSyxDQUFBO0dBQ2I7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBRSxHQUFHLEVBQVc7OztBQUM1QixTQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDYixTQUFPLENBQUMsR0FBRyxDQUFDLE1BQUcsR0FBRyxFQUFHLEdBQUcsQ0FBQyxDQUFBOztvQ0FGSCxJQUFJO0FBQUosUUFBSTs7O0FBRzFCLGNBQUEsT0FBTyxFQUFDLEdBQUcsTUFBQSxXQUFJLElBQUksQ0FBQyxDQUFBO0FBQ3BCLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDaEIiLCJmaWxlIjoiYXV0aG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMgYXMgZXhpc3RzIH0gZnJvbSAnZnMnXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRob3IgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnYXV0aG9yIFt3b3Jrc3BhY2VdJylcbiAgICAub3B0aW9uKCctLW1haW4gPHJlcXVpcmU+JywgJ3JlcXVpcmUgdGhpcyBzY3JpcHQgaW4gdGhlIGVsZWN0cm9uIG1haW4gcHJvY2VzcycpXG4gICAgLm9wdGlvbignLS1wcm9qZWN0IDxwYXRoPicsICd0aGUgcHJvamVjdCBwYXRoJylcbiAgICAub3B0aW9uKCctLWludGVyYWN0aXZlJywgJ3J1biBhbiBpbnRlcmFjdGl2ZSBSRVBMJylcbiAgICAub3B0aW9uKCctLWRvbnQtYm9vdCcsICdkb250IGJvb3QgdGhlIGVsZWN0cm9uIGFwcCAoREVWIEhFTFBFUiknKVxuICAgIC5kZXNjcmlwdGlvbigncnVuIGFuIGF1dGhvciB3b3Jrc3BhY2UgYXBwJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGF1dGhvclxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKHdvcmtzcGFjZSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgbGV0IHsgcHJvamVjdCB9ID0gY29udGV4dFxuXG4gIGxldCBlbGVjdHJvbiA9IGlzRWxlY3Ryb25JbnN0YWxsZWQoKVxuICBsZXQgc2t5cGFnZXJFbGVjdHJvbiA9IGlzU2t5cGFnZXJFbGVjdHJvbkluc3RhbGxlZCgpXG5cbiAgaWYgKCFlbGVjdHJvbikge1xuICAgIGFib3J0KCdtYWtlIHN1cmUgZWxlY3Ryb24tcHJlYnVpbHQgaXMgYXZhaWxhYmxlLiAgWW91IGNhbiBzcGVjaWZ5IGEgcGF0aCBtYW51YWxseSB2aWEgdGhlIEVMRUNUUk9OX1BSRUJVSUxUX1BBVEggZW52IHZhcicpXG4gIH1cblxuICBpZiAoIXNreXBhZ2VyRWxlY3Ryb24pIHtcbiAgICBhYm9ydCgnTWFrZSBzdXJlIHRoZSBza3lwYWdlci1lbGVjdHJvbiBwYWNrYWdlIGlzIGF2YWlsYWJsZS4gWW91IGNhbiBzcGVjaWZ5IGEgcGF0aCBtYW51YWxseSB2aWEgdGhlIFNLWVBBR0VSX0VMRUNUUk9OX1BBVEggZW52IHZhcicpXG4gIH1cblxuICBsZXQgYXV0aG9yQXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKVxuXG4gIGlmIChwcm9qZWN0KSB7XG4gICAgYXV0aG9yQXJncy5wdXNoKCctLXByb2plY3QnLCBwcm9qZWN0LnJvb3QpXG4gIH1cblxuICBsZXQgcHJvYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bihcbiAgICBlbGVjdHJvbixcbiAgICBbIHNreXBhZ2VyRWxlY3Ryb24gXS5jb25jYXQoYXV0aG9yQXJncylcbiAgKTtcblxuICBwcm9jLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhLnRvU3RyaW5nKCkpKVxuICBwcm9jLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhLnRvU3RyaW5nKCkpKVxufVxuXG5mdW5jdGlvbiBpc1NreXBhZ2VyRWxlY3Ryb25JbnN0YWxsZWQgKCkge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKCdwYXRoJykuZGlybmFtZShyZXF1aXJlLnJlc29sdmUoJ3NreXBhZ2VyLWVsZWN0cm9uJykpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzRWxlY3Ryb25JbnN0YWxsZWQgKCkge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKCdlbGVjdHJvbi1wcmVidWlsdCcpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gYWJvcnQgKG1zZywgLi4ucmVzdCkge1xuICBjb25zb2xlLmxvZygpXG4gIGNvbnNvbGUubG9nKGAke21zZ31gLnJlZClcbiAgY29uc29sZS5sb2coLi4ucmVzdClcbiAgcHJvY2Vzcy5leGl0KDEpXG59XG4iXX0=