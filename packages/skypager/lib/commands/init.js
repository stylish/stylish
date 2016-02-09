'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.handle = handle;

var _skypager = require('skypager');

var _trim = require('lodash/string/trim');

var _trim2 = _interopRequireDefault(_trim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(program, dispatch) {
  program.command('init <projectName> [destination]').description('create a new skypager project').option('--overwrite', 'whether or not to replace a project that exists').option('--destination', '').option('--plugins <list>', 'a comma separated list of plugins to use', list).action(function (projectName, options) {
    handle(projectName, options);
  });
}

function handle(projectName, destination) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _require = require('path');

  var resolve = _require.resolve;
  var join = _require.join;

  var _require2 = require('fs');

  var existsSync = _require2.existsSync;
  var writeFileSync = _require2.writeFileSync;

  var mkdir = require('mkdirp').sync;
  var set = require('object-path').set;

  destination = destination || options.destination || resolve(join(process.env.PWD, projectName));

  if (!existsSync(destination)) {
    mkdir(destination);
  }

  var man = {
    name: projectName,
    version: '1.0.0',
    skypager: {
      main: 'skypager.js',
      plugins: options.plugins ? ('' + options.plugins).split(',') : []
    },
    devDependencies: {
      'skypager': '^' + _skypager.manifest.version,
      'skypager-devpack': '^' + _skypager.manifest.version,
      'babel-preset-skypager': '^' + _skypager.manifest.version,
      'babel-runtime': '^6.4.0'
    }
  };

  if (options.plugins) {
    plugins.forEach(function (plugin) {
      man.devDependencies['skypager-plugin-' + plugin] = '*';
    });
  }

  var folders = ['docs/pages', 'data/settings', 'src', 'actions'];

  folders.forEach(function (path) {
    mkdir(join(destination, path));
  });

  function template() {
    for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
      parts[_key] = arguments[_key];
    }

    return function (content) {
      writeFileSync(join.apply(undefined, [destination].concat(parts)), content, 'utf8');
    };
  }

  template('package.json')((0, _stringify2.default)(man, null, 2));

  template('skypager.js')('\n      require(\'skypager/lib/util\').skypagerBabel()\n\n      module.exports = require(\'skypager\').load(__filename, {\n        manifest: require(\'./package.json\')\n      })\n      ', 'utf8');

  template('.babelrc')('{presets:["skypager"]}');

  template('.gitignore')(['logs/**/*.log', 'tmp/cache', '.DS_Store', '.env'].join("\n"));

  template('docs/outline.md')('---\n      type: outline\n      ---\n\n      ## Sections\n      ### Section A\n      ### Section B\n      '.replace(/^\s+/m, ''));

  template('docs/pages/cover.md')('---\n      type: page\n      cover: true\n      title: ' + projectName + '\n      ---\n\n      # Project Name\n');
}

exports.default = init;

function list(val) {
  return ('' + val).split(',').map(function (val) {
    return (0, _trim2.default)(val).toLowerCase();
  });
}