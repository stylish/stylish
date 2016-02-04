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
  program.command('author [workspace]').option('--main <require>', 'require this script in the electron main process').option('--workspace <name>', 'use a different workspace', 'main').option('--interactive', 'run an interactive REPL').option('--dont-boot', 'dont boot the electron app (DEV HELPER)').description('run an author workspace app').action(dispatch(handle));
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

  workspace = workspace || options.workspace || 'main';

  authorArgs.push('--workspace', workspace);

  if (project) {
    authorArgs.push('--project', project.root);
  }

  var proc = require('child_process').spawn(electron, [skypagerElectron].concat(authorArgs));

  if (options.interactive) {
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    process.stdin.pipe(proc.stdin);
  } else {
    proc.stdout.on('data', function (data) {
      return console.log(data.toString());
    });
    proc.stderr.on('data', function (data) {
      return console.log(data.toString());
    });
  }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdXRob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJZ0IsTUFBTSxHQUFOLE1BQU07UUFhTixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7O0FBYmYsU0FBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QyxTQUFPLENBQ0osT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQzdCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxrREFBa0QsQ0FBQyxDQUM5RSxNQUFNLENBQUMsb0JBQW9CLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQ2pFLE1BQU0sQ0FBQyxlQUFlLEVBQUUseUJBQXlCLENBQUMsQ0FDbEQsTUFBTSxDQUFDLGFBQWEsRUFBRSx5Q0FBeUMsQ0FBQyxDQUNoRSxXQUFXLENBQUMsNkJBQTZCLENBQUMsQ0FDMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxNQUFNO0FBRWQsU0FBUyxNQUFNLENBQUMsU0FBUyxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7TUFDcEQsT0FBTyxHQUFLLE9BQU8sQ0FBbkIsT0FBTzs7QUFFYixNQUFJLFFBQVEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3BDLE1BQUksZ0JBQWdCLEdBQUcsMkJBQTJCLEVBQUUsQ0FBQTs7QUFFcEQsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLFNBQUssQ0FBQyxtSEFBbUgsQ0FBQyxDQUFBO0dBQzNIOztBQUVELE1BQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUNyQixTQUFLLENBQUMsOEhBQThILENBQUMsQ0FBQTtHQUN0STs7QUFFRCxNQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdEMsV0FBUyxHQUFHLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQTs7QUFFcEQsWUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUE7O0FBRXpDLE1BQUksT0FBTyxFQUFFO0FBQ1gsY0FBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzNDOztBQUVELE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQ3ZDLFFBQVEsRUFDUixDQUFFLGdCQUFnQixDQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUN4QyxDQUFDOztBQUVGLE1BQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtBQUN2QixRQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLFdBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUMvQixNQUFNO0FBQ0wsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSTthQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQzlELFFBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUk7YUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUMvRDtDQUNGOztBQUVELFNBQVMsMkJBQTJCLEdBQUk7QUFDdEMsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtHQUNyRSxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2IsV0FBTyxLQUFLLENBQUE7R0FDZDtDQUNGOztBQUVELFNBQVMsbUJBQW1CLEdBQUk7QUFDOUIsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7R0FDcEMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFdBQU8sS0FBSyxDQUFBO0dBQ2I7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBRSxHQUFHLEVBQVc7OztBQUM1QixTQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDYixTQUFPLENBQUMsR0FBRyxDQUFDLE1BQUcsR0FBRyxFQUFHLEdBQUcsQ0FBQyxDQUFBOztvQ0FGSCxJQUFJO0FBQUosUUFBSTs7O0FBRzFCLGNBQUEsT0FBTyxFQUFDLEdBQUcsTUFBQSxXQUFJLElBQUksQ0FBQyxDQUFBO0FBQ3BCLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDaEIiLCJmaWxlIjoiYXV0aG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMgYXMgZXhpc3RzIH0gZnJvbSAnZnMnXG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRob3IgKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnYXV0aG9yIFt3b3Jrc3BhY2VdJylcbiAgICAub3B0aW9uKCctLW1haW4gPHJlcXVpcmU+JywgJ3JlcXVpcmUgdGhpcyBzY3JpcHQgaW4gdGhlIGVsZWN0cm9uIG1haW4gcHJvY2VzcycpXG4gICAgLm9wdGlvbignLS13b3Jrc3BhY2UgPG5hbWU+JywgJ3VzZSBhIGRpZmZlcmVudCB3b3Jrc3BhY2UnLCAnbWFpbicpXG4gICAgLm9wdGlvbignLS1pbnRlcmFjdGl2ZScsICdydW4gYW4gaW50ZXJhY3RpdmUgUkVQTCcpXG4gICAgLm9wdGlvbignLS1kb250LWJvb3QnLCAnZG9udCBib290IHRoZSBlbGVjdHJvbiBhcHAgKERFViBIRUxQRVIpJylcbiAgICAuZGVzY3JpcHRpb24oJ3J1biBhbiBhdXRob3Igd29ya3NwYWNlIGFwcCcpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBhdXRob3JcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSh3b3Jrc3BhY2UsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGxldCB7IHByb2plY3QgfSA9IGNvbnRleHRcblxuICBsZXQgZWxlY3Ryb24gPSBpc0VsZWN0cm9uSW5zdGFsbGVkKClcbiAgbGV0IHNreXBhZ2VyRWxlY3Ryb24gPSBpc1NreXBhZ2VyRWxlY3Ryb25JbnN0YWxsZWQoKVxuXG4gIGlmICghZWxlY3Ryb24pIHtcbiAgICBhYm9ydCgnbWFrZSBzdXJlIGVsZWN0cm9uLXByZWJ1aWx0IGlzIGF2YWlsYWJsZS4gIFlvdSBjYW4gc3BlY2lmeSBhIHBhdGggbWFudWFsbHkgdmlhIHRoZSBFTEVDVFJPTl9QUkVCVUlMVF9QQVRIIGVudiB2YXInKVxuICB9XG5cbiAgaWYgKCFza3lwYWdlckVsZWN0cm9uKSB7XG4gICAgYWJvcnQoJ01ha2Ugc3VyZSB0aGUgc2t5cGFnZXItZWxlY3Ryb24gcGFja2FnZSBpcyBhdmFpbGFibGUuIFlvdSBjYW4gc3BlY2lmeSBhIHBhdGggbWFudWFsbHkgdmlhIHRoZSBTS1lQQUdFUl9FTEVDVFJPTl9QQVRIIGVudiB2YXInKVxuICB9XG5cbiAgbGV0IGF1dGhvckFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMilcblxuICB3b3Jrc3BhY2UgPSB3b3Jrc3BhY2UgfHwgb3B0aW9ucy53b3Jrc3BhY2UgfHwgJ21haW4nXG5cbiAgYXV0aG9yQXJncy5wdXNoKCctLXdvcmtzcGFjZScsIHdvcmtzcGFjZSlcblxuICBpZiAocHJvamVjdCkge1xuICAgIGF1dGhvckFyZ3MucHVzaCgnLS1wcm9qZWN0JywgcHJvamVjdC5yb290KVxuICB9XG5cbiAgbGV0IHByb2MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd24oXG4gICAgZWxlY3Ryb24sXG4gICAgWyBza3lwYWdlckVsZWN0cm9uIF0uY29uY2F0KGF1dGhvckFyZ3MpXG4gICk7XG5cbiAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcbiAgICBwcm9jLnN0ZG91dC5waXBlKHByb2Nlc3Muc3Rkb3V0KVxuICAgIHByb2Muc3RkZXJyLnBpcGUocHJvY2Vzcy5zdGRlcnIpXG4gICAgcHJvY2Vzcy5zdGRpbi5waXBlKHByb2Muc3RkaW4pXG4gIH0gZWxzZSB7XG4gICAgcHJvYy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4gY29uc29sZS5sb2coZGF0YS50b1N0cmluZygpKSlcbiAgICBwcm9jLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhLnRvU3RyaW5nKCkpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzU2t5cGFnZXJFbGVjdHJvbkluc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoJ3BhdGgnKS5kaXJuYW1lKHJlcXVpcmUucmVzb2x2ZSgnc2t5cGFnZXItZWxlY3Ryb24nKSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFbGVjdHJvbkluc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoJ2VsZWN0cm9uLXByZWJ1aWx0JylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBhYm9ydCAobXNnLCAuLi5yZXN0KSB7XG4gIGNvbnNvbGUubG9nKClcbiAgY29uc29sZS5sb2coYCR7bXNnfWAucmVkKVxuICBjb25zb2xlLmxvZyguLi5yZXN0KVxuICBwcm9jZXNzLmV4aXQoMSlcbn1cbiJdfQ==