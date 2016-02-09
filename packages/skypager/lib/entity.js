'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entity = undefined;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Entity = exports.Entity = function Entity(source) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  (0, _classCallCheck3.default)(this, Entity);

  this.id = source.id;
  this.uri = source.uri;

  if (source.AssetClass.groupName === 'documents') {}

  if (source.AssetClass.groupName === 'data_sources') {}
};

exports.default = Entity;