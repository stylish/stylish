'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.availableProfiles = availableProfiles;
exports.availablePresets = availablePresets;
exports.argsFor = argsFor;
exports.devpack = devpack;

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

function argsFor(action, profile, environment, project) {
  var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  return profiles[profile](environment, project, options);
}

function devpack() {
  var action = arguments.length <= 0 || arguments[0] === undefined ? 'compile' : arguments[0];
  var profile = arguments[1];
  var environment = arguments[2];
  var project = arguments[3];
  var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  var argv = argsFor(profile, environment, project, options);

  if (action === 'build' || action === 'compile') {
    return require('../webpack/compiler')(argv);
  } else if (action === 'develop' || action === 'serve') {
    return require('../webpack/server')(argv);
  }
}

exports.default = devpack;