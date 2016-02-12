'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.routes = routes;

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = routes;
function routes(component) {
  var _root$childRoutes;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if ((typeof component === 'undefined' ? 'undefined' : (0, _typeof3.default)(component)) === 'object' && !options) {
    options = component;
    component = "div";
  }

  var _options = options;
  var entryPoints = _options.entryPoints;

  var root = { path: "/", component: component, childRoutes: [] };

  if (entryPoints.index) {
    root.indexRoute = entryPoints.index;
  }

  var childRoutes = keys(entryPoints).filter(function (key) {
    return key !== 'index';
  }).map(function (path, i) {
    return buildRoute(path, entryPoints[path], i);
  });

  (_root$childRoutes = root.childRoutes).push.apply(_root$childRoutes, (0, _toConsumableArray3.default)(childRoutes));

  var result = (0, _reactRouter.createRoutes)(root);

  return result;
}

function buildRoute(path) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var component = config.component;
  var route = { path: path, component: component };

  if (config.index) {
    route.indexRoute = {
      component: config.index.component || config.index
    };
  }
  return route;
}

var _Object = Object;
var keys = _Object.keys;
var assign = _Object.assign;