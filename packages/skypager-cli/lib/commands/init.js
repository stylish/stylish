'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.init = init;
exports.handle = handle;

var _jsYaml = require('js-yaml');

var _util = require('../util');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VERSION = require('../../package.json').version;

function init(program, dispatch) {
  program.command('init <projectName> [destination]').description('create a new skypager project').allowUnknownOption(true).option('--overwrite', 'whether or not to replace a project that exists').option('--destination', '').option('--plugins <list>', 'a comma separated list of plugins to use', list).option('--type', 'project, plugin, portfolio', 'project').action(function (projectName, options) {
    handle(projectName, options);
  });
}

function handle(projectName, destination) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _require = require('path');

  var resolve = _require.resolve;
  var join = _require.join;

  var mkdir = require('mkdirp').sync;

  destination = destination || options.destination || resolve(join(process.env.PWD, projectName));

  if ((0, _util.pathExists)(destination) && !options.overwrite) {
    abort('path already exists');
  }

  var type = options.type || 'project';
  var source = join(__dirname, '../../packages', type + '-template.asar');

  try {
    require('asar').extractAll(source, destination);
  } catch (error) {
    abort('Error extracting template: ' + error.message);
  }

  try {
    var packageJson = require(join(destination, 'package.json'));

    packageJson.name = projectName;
    packageJson.version = '1.0.0';

    require('fs').writeFileSync(join(destination, 'package.json'), (0, _stringify2.default)(packageJson, null, 2), 'utf8');

    require('fs').writeFileSync(join(destination, 'skypager.js'), 'module.exports = require(\'skypager-project\').load(__filename)\n', 'utf8');
  } catch (error) {
    abort('Error modifying package: ' + error.message);
  }

  console.log('Finished!');
}

exports.default = init;

function list(val) {
  return ('' + val).split(',').map(function (val) {
    return val.trim().toLowerCase();
  });
}

function abort(msg) {
  console.log(msg).red;
  process.exit(1);
}