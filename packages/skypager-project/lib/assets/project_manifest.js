'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectManifest = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = ['json'];
var GLOB = '*/package.json';

var ProjectManifest = exports.ProjectManifest = (function (_DataSource) {
  (0, _inherits3.default)(ProjectManifest, _DataSource);

  function ProjectManifest(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, ProjectManifest);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProjectManifest).call(this, uri, options));
  }

  (0, _createClass3.default)(ProjectManifest, [{
    key: 'name',
    get: function get() {
      return this.data.name;
    }
  }, {
    key: 'version',
    get: function get() {
      return this.data.version;
    }
  }, {
    key: 'repository',
    get: function get() {
      return this.data.repository;
    }
  }, {
    key: 'scripts',
    get: function get() {
      return this.data.scripts;
    }
  }, {
    key: 'skypager',
    get: function get() {
      return this.data.skypager;
    }
  }]);
  return ProjectManifest;
})(_data_source2.default);

ProjectManifest.EXTENSIONS = EXTENSIONS;
ProjectManifest.GLOB = GLOB;
exports.default = ProjectManifest;