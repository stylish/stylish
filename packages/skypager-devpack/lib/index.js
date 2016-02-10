'use strict';

var _mapValues = require('lodash/object/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _profiles = require('./profiles');

var profiles = _interopRequireWildcard(_profiles);

var _presets = require('./presets');

var presets = _interopRequireWildcard(_presets);

var _stages = require('./stages');

var stages = _interopRequireWildcard(_stages);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  availableStages: availableStages,
  availablePresets: availablePresets,
  availableProfiles: availableProfiles,
  devpack: devpack,
  webpack: webpack
};

function availableProfiles(project) {
  return (0, _mapValues2.default)(profiles, function (profile) {
    return profile.description;
  });
}

function availableStages(project) {
  return (0, _mapValues2.default)(stages, function (stage) {
    return stage.description;
  });
}

function availablePresets(project) {
  return (0, _mapValues2.default)(presets, function (preset) {
    return preset.description;
  });
}

function argsFor(profile, environment, project) {
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  return profiles[profile][profile](environment, project, options);
}

function devpack(action, profile, environment, project) {
  var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  var argv = argsFor(profile, environment, project, options);

  if (!action) {
    action = environment === 'production' ? 'build' : 'serve';
  }

  if (options.test) {
    return argv;
  }

  return webpack(action, argv);
}

function webpack(action, options) {
  if (action === 'build' || action === 'compile') {
    return require('./webpack/compiler')(options);
  } else if (action === 'develop' || action === 'serve' || action === 'dev' || action === 'dev-server') {
    return require('./webpack/server')(options);
  }
}