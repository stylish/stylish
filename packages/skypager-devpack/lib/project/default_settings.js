'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.DefaultSettings = DefaultSettings;

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var versions = {
  v1: require('../default_settings.json')
};

function DefaultSettings() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var version = versions[options.version || 'v1'] || versions.v1;

  return (0, _defaultsDeep2.default)({}, (0, _extends3.default)({}, version), options);
}

exports.default = DefaultSettings;