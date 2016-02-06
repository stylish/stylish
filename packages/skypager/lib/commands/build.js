'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.handle = handle;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function build(program, dispatch) {
  program.command('build [entry]').description('build a website for this project using our preconfigured webpack bundle').option('--entry <path>', 'relative path to the entry point', './src').option('--entry-name <name>', 'what to name the entry point script', 'app').option('--entry-only', 'only compiled asssets; do not use html template').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--external-vendors', "assume vendor libraries will be available to our script").option('--no-vendor-libraries', "don't include any vendor libraries in the bundle").option('--theme <name>', 'the name of the theme to use', 'dashboard').option('--output-folder <path>', 'relative path to the output folder', 'public').option('--html-filename <filename>', 'what should we name the html file?', 'index.html').option('--html-template-path <path>', 'path to the html template to use').option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc').option('--push-state', 'use a 200.html file to support push state').option('--content-hash', 'fingerprint the names of the files as a cache busting mechanism', true).option('--no-content-hash', 'fingerprint the names of the files as a cache busting mechanism', true).option('--dev-tools-path <path>', 'path to the skypager-devpack').option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config').option('--export-library <name>', 'build this as a umd library').option('--modules-path <path>', 'which modules folder to use for webpacks default? defaults to standard node_modules').option('--dist-path <path>', 'the project exporter or dist path').option('--skip-theme', 'do not include any skypager-theme content').option('--feature-flags <path>', 'path to a script which exports an object to be used for feature flags').option('--bundle', 'watch for content changes in the project and update the distribution bundle').option('--bundle-command', 'the command to run to generate the bundle default: skypager export bundle', 'skypager export bundle').option('--silent', 'suppress any server output').option('--debug', 'show error info from the server').option('--template-inject [target]', 'where to inject the webpack bundle? none, body, head').option('--exclude-chunks [list]', 'chunk names to exclude from the html bundle').option('--chunks [list]', 'chunk names to exclude from the html bundle').action(dispatch(handle));
}

exports.default = build;
function handle(entry) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  entry = entry || options.entry;
  options.theme = options.theme || project.options.theme;

  if (!options.theme && !options.skipTheme) {
    console.log('Are you sure you want to run without a theme?'.yellow);
  }

  process.env.NODE_ENV = 'production';

  var bundleCommand = options.bundleCommand || 'skypager export bundle';

  console.log('Exporting project bundle'.green);
  _shelljs2.default.exec(bundleCommand + ' --clean');

  require(pathToDevpack(options.devToolsPath) + '/webpack/compiler')(options);
}

function pathToDevpack(opt) {
  return opt && resolve(opt) || process.env.SKYPAGER_DEVPACK_PATH || (0, _path.dirname)(require.resolve('skypager-devpack'));
}

function isDepackInstalled() {
  try {
    return pathToDevpack();
  } catch (error) {
    return false;
  }
}