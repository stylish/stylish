'use strict';

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

var _framework = require('./framework');

var _framework2 = _interopRequireDefault(_framework);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _assets = require('./assets');

var _assets2 = _interopRequireDefault(_assets);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
  require('babel-polyfill');
} catch (e) {}

var Skypager = (function (_Framework) {
  (0, _inherits3.default)(Skypager, _Framework);

  function Skypager() {
    (0, _classCallCheck3.default)(this, Skypager);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Skypager).apply(this, arguments));
  }

  (0, _createClass3.default)(Skypager, [{
    key: 'Project',
    get: function get() {
      return _project2.default;
    }
  }, {
    key: 'Assets',
    get: function get() {
      return _assets2.default;
    }
  }, {
    key: 'Helpers',
    get: function get() {
      return _helpers2.default;
    }
  }, {
    key: 'Plugin',
    get: function get() {
      return _helpers2.default.Plugin;
    }
  }, {
    key: 'util',
    get: function get() {
      return util;
    }
  }]);
  return Skypager;
})(_framework2.default);

// this tries to ensure that only one instance of skypager lj

var framework = new Skypager(__dirname, 'skypager');

module.exports = framework;