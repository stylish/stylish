'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CopyFile = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _data_source = require('./data_source');

var _data_source2 = _interopRequireDefault(_data_source);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _result = require('lodash/result');

var _result2 = _interopRequireDefault(_result);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var CopyFile = exports.CopyFile = (function (_DataSource) {
  (0, _inherits3.default)(CopyFile, _DataSource);

  function CopyFile(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, CopyFile);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CopyFile).call(this, uri, options));

    _this.indexer = parseSettings.bind(_this);
    return _this;
  }

  /*
   * This lets us write less nested
   * versions of a settings file
   */

  (0, _createClass3.default)(CopyFile, [{
    key: 'getData',
    value: function getData() {
      if (this.extension !== '.js' && (!this.raw || this.raw.length === 0)) {
        this.runImporter('disk', { asset: this, sync: true });
      }

      var value = this.indexed;
      var parts = this.id.split('/');
      var last = parts[parts.length - 1];

      if (value[last] && keys(value).length === 1) {
        value = value[last] || {};
      }

      if ((0, _get2.default)(value, process.env.NODE_ENV)) {
        value = (0, _get2.default)(value, process.env.NODE_ENV);
      }

      var project = this.project;

      var lang = project && project.get('settings.app.locale') || 'en';

      if ((0, _get2.default)(value, lang)) {
        value = (0, _get2.default)(value, lang);
      }

      return value;
    }
  }]);
  return CopyFile;
})(_data_source2.default);

CopyFile.EXTENSIONS = EXTENSIONS;
CopyFile.GLOB = GLOB;
exports.default = CopyFile;

function interpolateValues(obj, template) {
  var datasource = this;

  (0, _keys2.default)(obj).forEach(function (key) {
    var value = obj[key];

    if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
      interpolateValues.call(datasource, value, template);
    } else if (typeof value === 'string' && value.match(/^env\.\w+$/i)) {
      value = '<%= process.' + value + ' %>';
      obj[key] = template(value)(value);
    } else if (typeof value === 'string') {
      obj[key] = template(value)(value);
    }
  });

  return obj;
}

function parseSettings() {
  var val = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return interpolateValues.call(this, (0, _clone2.default)(val), this.templater.bind(this));
}

var _Object = Object;
var keys = _Object.keys;