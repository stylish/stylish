'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Script = exports.GLOB = exports.EXTENSIONS = undefined;

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

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _docblock = require('../utils/docblock');

var _docblock2 = _interopRequireDefault(_docblock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = exports.EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6'];
var GLOB = exports.GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

// can parse, index, transform js with babel

var Script = exports.Script = (function (_Asset) {
  (0, _inherits3.default)(Script, _Asset);

  function Script() {
    (0, _classCallCheck3.default)(this, Script);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Script).apply(this, arguments));
  }

  (0, _createClass3.default)(Script, [{
    key: 'getData',
    value: function getData() {
      if (!this.raw || this.raw.length === 0) {
        this.runImporter('disk', { asset: this, sync: true });
      }

      return this.frontmatter || {};
    }
  }, {
    key: 'frontmatter',
    get: function get() {
      try {
        return _docblock2.default.parse(this.raw);
      } catch (error) {
        return {};
      }
    }
  }]);
  return Script;
})(_asset2.default);

exports.default = Script;