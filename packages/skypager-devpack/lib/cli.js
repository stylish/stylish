'use strict';

var _path = require('path');

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _profiles = require('./webpack/profiles');

var profiles = _interopRequireWildcard(_profiles);

var _presets = require('./webpack/profiles/presets');

var presets = _interopRequireWildcard(_presets);

var _stages = require('./webpack/profiles/stages');

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

function webpack(action) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (action === 'build' || action === 'compile') {
    return require('./webpack/compiler').apply(undefined, args);
  } else if (action === 'develop' || action === 'serve' || action === 'dev' || action === 'dev-server') {
    return require('./webpack/server').apply(undefined, args);
  } else if (action === 'test:server' || action === 'test') {
    return require('./webpack/test').apply(undefined, args);
  }
}