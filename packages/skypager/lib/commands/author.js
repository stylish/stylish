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
  program.command('author [workspace]').option('--main <require>', 'require this script in the electron main process').option('--workspace <name>', 'use a different workspace', 'main').option('--interactive', 'run an interactive REPL').option('--dont-boot', 'dont boot the electron app (DEV HELPER)').option('--stream-actions', 'debug the action stream').description('run an author workspace app').action(dispatch(handle));
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
    proc.stdout.on('data', function (data) {
      return process.stdout.write(data);
    });
    proc.stderr.on('data', function (data) {
      return process.stderr.write(data);
    });
    process.stdin.on('data', function (data) {
      return proc.stdin.write(data);
    });
  }

  if (!options.interactive) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdXRob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJZ0IsTUFBTSxHQUFOLE1BQU07UUFjTixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7O0FBZGYsU0FBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QyxTQUFPLENBQ0osT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQzdCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxrREFBa0QsQ0FBQyxDQUM5RSxNQUFNLENBQUMsb0JBQW9CLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQ2pFLE1BQU0sQ0FBQyxlQUFlLEVBQUUseUJBQXlCLENBQUMsQ0FDbEQsTUFBTSxDQUFDLGFBQWEsRUFBRSx5Q0FBeUMsQ0FBQyxDQUNoRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUseUJBQXlCLENBQUMsQ0FDckQsV0FBVyxDQUFDLDZCQUE2QixDQUFDLENBQzFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUM1Qjs7a0JBRWMsTUFBTTtBQUVkLFNBQVMsTUFBTSxDQUFDLFNBQVMsRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFO01BQ3BELE9BQU8sR0FBSyxPQUFPLENBQW5CLE9BQU87O0FBRWIsTUFBSSxRQUFRLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtBQUNwQyxNQUFJLGdCQUFnQixHQUFHLDJCQUEyQixFQUFFLENBQUE7O0FBRXBELE1BQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixTQUFLLENBQUMsbUhBQW1ILENBQUMsQ0FBQTtHQUMzSDs7QUFFRCxNQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDckIsU0FBSyxDQUFDLDhIQUE4SCxDQUFDLENBQUE7R0FDdEk7O0FBRUQsTUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXRDLFdBQVMsR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUE7O0FBRXBELFlBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFBOztBQUV6QyxNQUFJLE9BQU8sRUFBRTtBQUNYLGNBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUMzQzs7QUFFRCxNQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUN2QyxRQUFRLEVBQ1IsQ0FBRSxnQkFBZ0IsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FDeEMsQ0FBQzs7QUFFRixNQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7QUFDdkIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSTthQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUM1RCxRQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJO2FBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQzVELFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUk7YUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7S0FBQSxDQUFDLENBQUE7R0FDM0Q7O0FBRUQsTUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7QUFDeEIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSTthQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQzlELFFBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUk7YUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUMvRDtDQUNGOztBQUVELFNBQVMsMkJBQTJCLEdBQUk7QUFDdEMsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtHQUNyRSxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2IsV0FBTyxLQUFLLENBQUE7R0FDZDtDQUNGOztBQUVELFNBQVMsbUJBQW1CLEdBQUk7QUFDOUIsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7R0FDcEMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFdBQU8sS0FBSyxDQUFBO0dBQ2I7Q0FDRjs7QUFFRCxTQUFTLEtBQUssQ0FBRSxHQUFHLEVBQVc7OztBQUM1QixTQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDYixTQUFPLENBQUMsR0FBRyxDQUFDLE1BQUcsR0FBRyxFQUFHLEdBQUcsQ0FBQyxDQUFBOztvQ0FGSCxJQUFJO0FBQUosUUFBSTs7O0FBRzFCLGNBQUEsT0FBTyxFQUFDLEdBQUcsTUFBQSxXQUFJLElBQUksQ0FBQyxDQUFBO0FBQ3BCLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDaEIiLCJmaWxlIjoiYXV0aG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMgYXMgZXhpc3RzLCBjcmVhdGVSZWFkU3RyZWFtIGFzIHJlYWRTcmVhbSB9IGZyb20gJ2ZzJ1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0aG9yIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2F1dGhvciBbd29ya3NwYWNlXScpXG4gICAgLm9wdGlvbignLS1tYWluIDxyZXF1aXJlPicsICdyZXF1aXJlIHRoaXMgc2NyaXB0IGluIHRoZSBlbGVjdHJvbiBtYWluIHByb2Nlc3MnKVxuICAgIC5vcHRpb24oJy0td29ya3NwYWNlIDxuYW1lPicsICd1c2UgYSBkaWZmZXJlbnQgd29ya3NwYWNlJywgJ21haW4nKVxuICAgIC5vcHRpb24oJy0taW50ZXJhY3RpdmUnLCAncnVuIGFuIGludGVyYWN0aXZlIFJFUEwnKVxuICAgIC5vcHRpb24oJy0tZG9udC1ib290JywgJ2RvbnQgYm9vdCB0aGUgZWxlY3Ryb24gYXBwIChERVYgSEVMUEVSKScpXG4gICAgLm9wdGlvbignLS1zdHJlYW0tYWN0aW9ucycsICdkZWJ1ZyB0aGUgYWN0aW9uIHN0cmVhbScpXG4gICAgLmRlc2NyaXB0aW9uKCdydW4gYW4gYXV0aG9yIHdvcmtzcGFjZSBhcHAnKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXV0aG9yXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUod29ya3NwYWNlLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsZXQgeyBwcm9qZWN0IH0gPSBjb250ZXh0XG5cbiAgbGV0IGVsZWN0cm9uID0gaXNFbGVjdHJvbkluc3RhbGxlZCgpXG4gIGxldCBza3lwYWdlckVsZWN0cm9uID0gaXNTa3lwYWdlckVsZWN0cm9uSW5zdGFsbGVkKClcblxuICBpZiAoIWVsZWN0cm9uKSB7XG4gICAgYWJvcnQoJ21ha2Ugc3VyZSBlbGVjdHJvbi1wcmVidWlsdCBpcyBhdmFpbGFibGUuICBZb3UgY2FuIHNwZWNpZnkgYSBwYXRoIG1hbnVhbGx5IHZpYSB0aGUgRUxFQ1RST05fUFJFQlVJTFRfUEFUSCBlbnYgdmFyJylcbiAgfVxuXG4gIGlmICghc2t5cGFnZXJFbGVjdHJvbikge1xuICAgIGFib3J0KCdNYWtlIHN1cmUgdGhlIHNreXBhZ2VyLWVsZWN0cm9uIHBhY2thZ2UgaXMgYXZhaWxhYmxlLiBZb3UgY2FuIHNwZWNpZnkgYSBwYXRoIG1hbnVhbGx5IHZpYSB0aGUgU0tZUEFHRVJfRUxFQ1RST05fUEFUSCBlbnYgdmFyJylcbiAgfVxuXG4gIGxldCBhdXRob3JBcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpXG5cbiAgd29ya3NwYWNlID0gd29ya3NwYWNlIHx8IG9wdGlvbnMud29ya3NwYWNlIHx8ICdtYWluJ1xuXG4gIGF1dGhvckFyZ3MucHVzaCgnLS13b3Jrc3BhY2UnLCB3b3Jrc3BhY2UpXG5cbiAgaWYgKHByb2plY3QpIHtcbiAgICBhdXRob3JBcmdzLnB1c2goJy0tcHJvamVjdCcsIHByb2plY3Qucm9vdClcbiAgfVxuXG4gIGxldCBwcm9jID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduKFxuICAgIGVsZWN0cm9uLFxuICAgIFsgc2t5cGFnZXJFbGVjdHJvbiBdLmNvbmNhdChhdXRob3JBcmdzKVxuICApO1xuXG4gIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgcHJvYy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4gcHJvY2Vzcy5zdGRvdXQud3JpdGUoZGF0YSkpXG4gICAgcHJvYy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4gcHJvY2Vzcy5zdGRlcnIud3JpdGUoZGF0YSkpXG4gICAgcHJvY2Vzcy5zdGRpbi5vbignZGF0YScsIChkYXRhKSA9PiBwcm9jLnN0ZGluLndyaXRlKGRhdGEpKVxuICB9XG5cbiAgaWYgKCFvcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgcHJvYy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4gY29uc29sZS5sb2coZGF0YS50b1N0cmluZygpKSlcbiAgICBwcm9jLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhLnRvU3RyaW5nKCkpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzU2t5cGFnZXJFbGVjdHJvbkluc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoJ3BhdGgnKS5kaXJuYW1lKHJlcXVpcmUucmVzb2x2ZSgnc2t5cGFnZXItZWxlY3Ryb24nKSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFbGVjdHJvbkluc3RhbGxlZCAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoJ2VsZWN0cm9uLXByZWJ1aWx0JylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBhYm9ydCAobXNnLCAuLi5yZXN0KSB7XG4gIGNvbnNvbGUubG9nKClcbiAgY29uc29sZS5sb2coYCR7bXNnfWAucmVkKVxuICBjb25zb2xlLmxvZyguLi5yZXN0KVxuICBwcm9jZXNzLmV4aXQoMSlcbn1cbiJdfQ==