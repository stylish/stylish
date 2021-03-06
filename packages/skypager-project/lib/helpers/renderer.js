'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Renderer = (function (_Helper) {
  (0, _inherits3.default)(Renderer, _Helper);

  function Renderer() {
    (0, _classCallCheck3.default)(this, Renderer);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Renderer).apply(this, arguments));
  }

  (0, _createClass3.default)(Renderer, [{
    key: 'helperType',
    get: function get() {
      return 'renderer';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Renderer;
    }
  }]);
  return Renderer;
})(_helper2.default); /**
                      *
                      * Renderers are functions which turn an entity into something like HTML
                      *
                      */

exports.default = Renderer;