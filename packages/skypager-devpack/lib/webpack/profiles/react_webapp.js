'use strict';

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _result = require('lodash/object/result');

var _result2 = _interopRequireDefault(_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = 'Multi-page React Webapp with Client-side Routing';

module.exports = {
  react_webapp: react_webapp,
  description: description
};

function react_webapp(env, project) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return env === 'production' ? production(project, options) : development(project, options);
}

function production(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    contentHash: true,
    env: 'production',
    platform: 'web',
    publicPath: '/',
    pushState: true,
    theme: (0, _result2.default)(project, 'options.theme') || (0, _result2.default)(project, 'settings.themes.theme') || (0, _result2.default)(project, 'settings.themes.base') || options.theme
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
    theme: (0, _result2.default)(project, 'options.theme') || (0, _result2.default)(project, 'settings.themes.theme') || (0, _result2.default)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.development'));
}