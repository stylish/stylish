'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

exports.routes = routes;

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _values3 = require('lodash/values');

var _values4 = _interopRequireDefault(_values3);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = routes;
function routes(_ref) {
  var layout = _ref.layout;
  var screens = _ref.screens;
  var project = _ref.project;

  var base = {
    path: '/',

    component: layout,

    indexRoute: {
      component: screens.index
    }
  };

  var childRouteConfig = (0, _omit2.default)(screens, 'default', 'index', '/');

  // TODO: ability for a component to act as an entry point. we can assume entry points
  // are already exported as plainRoute objects, which they should be to take advantage of
  // webpack code splitting via require.ensure.  Components would just need to be wrapped in
  // a plainRoute object interface
  var plainRoutes = (0, _mapValues2.default)(childRouteConfig, function (entryPoint, name) {
    return toPlainRoute(entryPoint, name, project);
  });

  base.childRoutes = (0, _values2.default)(plainRoutes);

  return base;
}

function toPlainRoute(component, path, project) {
  path = path || component.path;

  if (!path) {
    throw 'Can not build a plain route object if the component does not define a path or if you do not provide one';
  }

  try {
    // already a plain route object apparently
    if ((typeof component === 'undefined' ? 'undefined' : (0, _typeof3.default)(component)) === 'object' && component && component.path && (hasOwnProperty(component, 'component') || hasOwnProperty(component, 'getComponent'))) {
      return component;
    }
  } catch (error) {
    console.log(error.message, component);
    throw error;
  }

  var plainRoute = {
    path: path,
    component: component
  };

  if (component.childRoutes) {
    plainRoute.childRoutes = (0, _values2.default)((0, _mapValues2.default)(component.childRoutes, function (comp, path) {
      console.log('sheeeit', comp, path);
      return toPlainRoute((0, _isString2.default)(comp) ? project.requireScreen(comp) : comp, path, project);
    }));
  }

  if (component.components) {
    plainRoute.components = (0, _mapValues2.default)(component.components, function (comp) {
      return (0, _isString2.default)(comp) ? project.requireComponent(comp) : comp;
    });
  }

  console.log('returning', plainRoute);
  return plainRoute;
}