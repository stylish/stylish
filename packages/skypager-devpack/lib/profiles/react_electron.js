'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.ReactElectron = ReactElectron;
exports.production = production;
exports.development = development;

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'multi-page React app built for Electron';

function ReactElectron() {
  var environment = arguments.length <= 0 || arguments[0] === undefined ? 'production' : arguments[0];
  var project = arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  switch (environment) {
    case development:
      return development(project, options);
      break;

    case production:

    default:
      return production(project, options);
  }

  return production(project, options);
}

exports.default = ReactElectron;
function production(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    contentHash: false,
    env: 'production',
    htmlFileName: 'index.html',
    publicPath: '',
    platform: 'electron',
    theme: project.options.theme || project.get('settings.themes.theme') || project.get('settings.themes.base') || options.theme
  }, project.get('settings.build.production'));
}

function development(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    contentHash: false,
    env: 'development',
    htmlFileName: 'index.html',
    platform: 'electron',
    publicPath: '/',
    theme: project.options.theme || project.get('settings.themes.theme') || project.get('settings.themes.base') || options.theme
  }, project.get('settings.build.development'));
}