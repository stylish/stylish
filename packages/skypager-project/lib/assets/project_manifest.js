'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectManifest = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _data_source = require('./data_source');

var _data_source2 = _interopRequireDefault(_data_source);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = ['json'];
var GLOB = '*/package.json';

var ProjectManifest = exports.ProjectManifest = (function (_DataSource) {
  (0, _inherits3.default)(ProjectManifest, _DataSource);
  (0, _createClass3.default)(ProjectManifest, null, [{
    key: 'decorateCollection',
    value: function decorateCollection(collection) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var assetClass = this;

      defineProperty(collection, 'findDependentsOf', {
        enumerable: false,
        configurable: true,
        value: function value(utility) {
          return assetClass.findDependentsOf(utility, collection);
        }
      }), defineProperty(collection, 'findProvidersOf', {
        enumerable: false,
        configurable: true,
        value: function value(utility) {
          return assetClass.findProvidersOf(utility, collection);
        }
      });
    }

    /**
     * Find all packages that depend on the specific package.
     *
     * This will look in allDependencies
     *
     * @param {String} packageName the name of an npm module
     *
    */

  }, {
    key: 'findDependentsOf',
    value: function findDependentsOf(packageName, collection) {
      return collection.query(function (p) {
        return p.allDependencies[packageName];
      });
    }

    /**
     * Find all packages that provide the specified utility.
     *
     * This will search the skypager.provides value for a given utility,
     * e.g. devtools, ui components, themes, etc.
    */

  }, {
    key: 'findProvidersOf',
    value: function findProvidersOf(utility, collection) {
      return collection.query(function (p) {
        return p.provides.indexOf(utility) >= 0 || p.provides.indexOf(utility + 's') >= 0 || p.provides.indexOf(('' + utility).replace(/s$/i, '')) > 0;
      });
    }
  }]);

  function ProjectManifest(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, ProjectManifest);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProjectManifest).call(this, uri, options));
  }

  (0, _createClass3.default)(ProjectManifest, [{
    key: 'generateId',
    value: function generateId() {
      return this.paths.relative.replace(this.extension, '').replace('/package', '');
    }
  }, {
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
    key: 'dependencies',
    get: function get() {
      return this.data.dependencies || {};
    }
  }, {
    key: 'devDependencies',
    get: function get() {
      return this.data.devDependencies || {};
    }
  }, {
    key: 'optionalDependencies',
    get: function get() {
      return this.data.optionalDependencies || {};
    }
  }, {
    key: 'peerDependencies',
    get: function get() {
      return this.data.peerDependencies || {};
    }
  }, {
    key: 'allDependencies',
    get: function get() {
      return (0, _assign2.default)({}, (0, _extends3.default)({}, this.dependencies, this.devDependencies, this.peerDependencies, this.optionalDependencies));
    }
  }, {
    key: 'allDependencyNames',
    get: function get() {
      return (0, _keys2.default)(this.allDependencies);
    }
  }, {
    key: 'skypagerDependencies',
    get: function get() {
      return (0, _pickBy2.default)(this.allDependencies, function (value, key) {
        return key.match(/^skypager/);
      });
    }
  }, {
    key: 'skypager',
    get: function get() {
      return this.data.skypager;
    }
  }, {
    key: 'provides',
    get: function get() {
      return this.skypager && this.skypager.provides || [];
    }
  }]);
  return ProjectManifest;
})(_data_source2.default);

ProjectManifest.EXTENSIONS = EXTENSIONS;
ProjectManifest.GLOB = GLOB;
exports.default = ProjectManifest;
var _Object = Object;
var defineProperty = _Object.defineProperty;