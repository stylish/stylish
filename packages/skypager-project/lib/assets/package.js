'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SettingsFile = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _data_source = require('./data_source');

var _data_source2 = _interopRequireDefault(_data_source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var SettingsFile = exports.SettingsFile = (function (_DataSource) {
  (0, _inherits3.default)(SettingsFile, _DataSource);

  function SettingsFile(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, SettingsFile);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SettingsFile).call(this, uri, options));

    _this.indexer = parseSettings.bind(_this);
    return _this;
  }

  return SettingsFile;
})(_data_source2.default);

SettingsFile.EXTENSIONS = EXTENSIONS;
SettingsFile.GLOB = GLOB;
exports.default = SettingsFile;

function parseSettings() {
  var val = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return interpolateValues.call(this, clone(val), this.templater.bind(this));
}