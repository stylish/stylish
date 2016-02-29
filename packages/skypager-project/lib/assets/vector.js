'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// can parse / index / transform with xml

var Vector = (function (_Asset) {
  (0, _inherits3.default)(Vector, _Asset);

  function Vector() {
    (0, _classCallCheck3.default)(this, Vector);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Vector).apply(this, arguments));
  }

  return Vector;
})(_asset2.default);

Vector.EXTENSIONS = ['svg'];
Vector.GLOB = '**/*.svg';

exports = module.exports = Vector;