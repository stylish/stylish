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

var Exporter = (function (_Helper) {
  (0, _inherits3.default)(Exporter, _Helper);

  function Exporter() {
    (0, _classCallCheck3.default)(this, Exporter);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Exporter).apply(this, arguments));
  }

  (0, _createClass3.default)(Exporter, [{
    key: 'helperType',
    get: function get() {
      return 'exporter';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Exporter;
    }
  }]);
  return Exporter;
})(_helper2.default); /**
                      *
                      * Exporters are functions which get run on a Project or Entity and can be used to transform that project
                      * into some other form, for example a static html website, a react application, a zip, or a PDF.
                      *
                      */

exports.default = Exporter;