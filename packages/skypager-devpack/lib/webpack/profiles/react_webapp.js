'use strict';

var _lodash = require('lodash');

var description = 'Multi-page React Webapp with Client-side Routing';

module.exports = {
  web: react_webapp,
  react_webapp: react_webapp,
  description: description
};

function react_webapp(env, project) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return env === 'production' ? production(project, options) : development(project, options);
}

function production(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _lodash.defaults)({
    contentHash: true,
    env: 'production',
    platform: 'web',
    publicPath: '/',
    pushState: true,
    theme: (0, _lodash.get)(project, 'options.theme') || (0, _lodash.get)(project, 'settings.themes.theme') || (0, _lodash.get)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.production'));
}

function development(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _lodash.defaults)({
    env: 'development',
    contentHash: false,
    platform: 'web',
    pushState: true,
    publicPath: '/',
    theme: (0, _lodash.get)(project, 'options.theme') || (0, _lodash.get)(project, 'settings.themes.theme') || (0, _lodash.get)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.development'));
}