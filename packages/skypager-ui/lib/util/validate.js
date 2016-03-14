'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.validate = validate;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(props, App) {
  var layout = props.layout;
  var screens = props.screens;
  var project = props.project;

  project = project || props.bundle;

  (0, _invariant2.default)(typeof project !== 'undefined', 'Must supply a project bundle. These are generated with the skypager export bundle command');

  (0, _invariant2.default)(typeof project.settings !== 'undefined', 'The project must include a settings object');

  screens = screens || project.settings.screens;

  (0, _invariant2.default)((typeof screens === 'undefined' ? 'undefined' : (0, _typeof3.default)(screens)) === 'object', 'Must specify screens in the app settings. This should be an object which references entry points, or components');

  (0, _invariant2.default)(screens.index || screens.default, 'The Application screens should define and "index" or "default" value');

  (0, _invariant2.default)(typeof layout !== 'undefined', 'Application settings failed to specify a root layout container');

  return props;
}

exports.default = validate;
var _Object = Object;
var hasOwnProperty = _Object.hasOwnProperty;
var values = _Object.values;