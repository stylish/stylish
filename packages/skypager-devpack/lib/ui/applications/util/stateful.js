'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateful = stateful;

var _react = require('react');

var _reactRedux = require('react-redux');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = stateful;
function stateful(component) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var _parse = parse.apply(undefined, args);

  var stateProps = _parse.stateProps;

  var connected = undefined;

  component.contextTypes = component.contextTypes || {};
  component.contextTypes.project = _react.PropTypes.object.isRequired;

  function mapSelectedProps(state) {
    return stateProps.reduce(function (memo, prop) {
      var p = prop.split('.');
      var propName = p[p.length - 1];
      memo[propName] = (0, _get2.default)(state, prop);

      return memo;
    }, {});
  }

  if (stateProps && stateProps.length > 0) {
    connected = (0, _reactRedux.connect)(mapSelectedProps)(component);
  } else {
    connected = _reactRedux.connect.apply(undefined, args)(component);
  }

  connected.contextTypes.project = _react.PropTypes.object.isRequired;

  return connected;
}

function parse() {
  var options = {};

  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (args.length > 0 && args.every(function (a) {
    return typeof a === 'string';
  })) {
    options.stateProps = args;
  }

  return options;
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;