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

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Importer = (function (_Helper) {
  (0, _inherits3.default)(Importer, _Helper);

  function Importer() {
    (0, _classCallCheck3.default)(this, Importer);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Importer).apply(this, arguments));
  }

  (0, _createClass3.default)(Importer, [{
    key: 'helperType',
    get: function get() {
      return 'importer';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Importer;
    }
  }]);
  return Importer;
})(_helper2.default); /**
                      * Importers are special functions which import a URI such as a local
                      * path and turn it into a Project, or in some cases an Entity or a
                      * collection of Entities.
                      */

exports.default = Importer;