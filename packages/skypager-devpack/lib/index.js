'use strict';

var _mapValues = require('lodash/object/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _profiles = require('./profiles');

var profiles = _interopRequireWildcard(_profiles);

var _presets = require('./presets');

var presets = _interopRequireWildcard(_presets);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  availablePresets: availablePresets,
  availableProfiles: availableProfiles,
  devpack: devpack
};

function availableProfiles(project) {
  return (0, _mapValues2.default)(profiles, function (profile) {
    return profile.description;
  });
}

function availablePresets(project) {
  return (0, _mapValues2.default)(presets, function (profile) {
    return preset.description;
  });
}

function argsFor(profile, environment, project) {
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  return profiles[profile](environment, project, options);
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

  if (action === 'build' || action === 'compile') {
    return require('../webpack/compiler')(argv);
  } else if (action === 'develop' || action === 'serve') {
    return require('../webpack/server')(argv);
  }
}