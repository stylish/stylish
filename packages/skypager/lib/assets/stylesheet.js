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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stylesheet = exports.GLOB = exports.EXTENSIONS = undefined;

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = exports.EXTENSIONS = ['css', 'less', 'scss', 'sass'];
var GLOB = exports.GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

/**
* Ideas:
*
* Parse a stylesheet to learn about the rules it exposes
*/

var Stylesheet = exports.Stylesheet = (function (_Asset) {
  (0, _inherits3.default)(Stylesheet, _Asset);

  function Stylesheet() {
    (0, _classCallCheck3.default)(this, Stylesheet);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Stylesheet).apply(this, arguments));
  }

  (0, _createClass3.default)(Stylesheet, [{
    key: 'imports',
    get: function get() {
      return ['TODO: list which dependencies it imports'];
    }
  }, {
    key: 'usesVariables',
    get: function get() {
      return ['TODO: list which variables it uses'];
    }
  }, {
    key: 'variables',
    get: function get() {
      return ['TODO: list which variables it defines'];
    }
  }]);
  return Stylesheet;
})(_asset2.default);

exports.default = Stylesheet;