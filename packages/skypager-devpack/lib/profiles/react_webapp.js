'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.ReactWebapp = ReactWebapp;
exports.production = production;
exports.development = development;

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'Multi-page React Webapp with Client-side Routing';

function ReactWebapp() {
  var environment = arguments.length <= 0 || arguments[0] === undefined ? 'production' : arguments[0];
  var project = arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  switch (environment) {
    case development:
      return development(project, options);

    case production:
      return production(project, options);

    default:
      return production(project, options);
  }

  return production(project, options);
}

exports.default = ReactWebapp;
function production(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    contentHash: true,
    env: 'production',
    platform: 'web',
    publicPath: '/',
    pushState: true,
    theme: project.options.theme || project.get('settings.themes.theme') || project.get('settings.themes.base') || options.theme
  }, project.get('settings.build.production'));
}

function development(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    env: 'development',
    contentHash: false,
    platform: 'web',
    pushState: true,
    publicPath: '/',
    theme: project.options.theme || project.get('settings.themes.theme') || project.get('settings.themes.base') || options.theme
  }, project.get('settings.build.development'));
}