'use strict';

var _react_electron = require('./react_electron');

var _react_electron2 = _interopRequireDefault(_react_electron);

var _react_webapp = require('./react_webapp');

var _react_webapp2 = _interopRequireDefault(_react_webapp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  web: _react_webapp2.default,
  react_webapp: _react_webapp2.default,
  electron: _react_electron2.default,
  react_electron: _react_electron2.default
};