'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.author = author;
exports.handle = handle;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _path = require('path');

var _util = require('../util');

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

  var skypagerElectron = undefined;

  if (isSkypagerElectronInstalled()) {
    skypagerElectron = process.env.SKYPAGER_ELECTRON_ROOT || $skypager && $skypager.electron || $skypager && $skypager['skypager-electron'] || require.resolve('skypager-electron');
    console.log('INSTALLED)');
  } else {
    console.log('NOT INSTALLED');
  }

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

  var proc = require('child_process').spawn(electron, [skypagerElectron].concat(authorArgs), {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
}

function isSkypagerElectronInstalled() {
  try {
    return (0, _util.pathExists)(process.env.SKYPAGER_ELECTRON_ROOT || $skypager && $skypager.electron || $skypager && $skypager['skypager-electron'] || require.resolve('skypager-electron'));
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