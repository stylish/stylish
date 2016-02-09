'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _model = require('./definitions/model');

var _path = require('path');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = (function (_Helper) {
  (0, _inherits3.default)(Model, _Helper);

  function Model() {
    var _Object$getPrototypeO;

    (0, _classCallCheck3.default)(this, Model);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Model)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.entities = {};
    return _this;
  }

  (0, _createClass3.default)(Model, [{
    key: 'config',
    get: function get() {
      return this.definition && this.definition.config || {};
    }
  }, {
    key: 'attributes',
    get: function get() {
      var base = this.required.attributes || {};
      return (0, _assign2.default)(base, this.config.attributes || {});
    }
  }, {
    key: 'name',
    get: function get() {
      return this.definition && this.definition.name || this.id;
    }
  }, {
    key: 'generate',
    get: function get() {
      return this.definition && this.definition.api.generate;
    }
  }, {
    key: 'actions',
    get: function get() {
      return this.definition && this.definition.config.actions;
    }
  }], [{
    key: 'validate',
    value: function validate(instance) {
      return true;
    }
  }]);
  return Model;
})(_helper2.default);

Model.DSL = _model.DSL;
Model.Definition = _model.ModelDefinition;

module.exports = Model;