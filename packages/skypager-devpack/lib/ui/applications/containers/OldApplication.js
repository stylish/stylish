'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _jsxFileName = 'src/ui/applications/containers/OldApplication.js';
exports.sanitize = sanitize;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _stores = require('../util/stores');

var _routes = require('../util/routes');

var _stateful = require('../util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _DefaultLayout = require('ui/layouts/DefaultLayout');

var _DefaultLayout2 = _interopRequireDefault(_DefaultLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultInitialState = [];
var defaultReducers = [];
var defaultMiddlewares = [];

var version = 0;
var app = undefined;

var Application = exports.Application = (function (_Component) {
  (0, _inherits3.default)(Application, _Component);
  (0, _createClass3.default)(Application, null, [{
    key: 'create',

    /**
     * Main Entry Point
     *
     * @example
     *
     * import project from 'dist/bundle'
     *
     * Application.create({
     *  project
     * })
     *
     */
    value: function create() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      options = sanitize(options);

      var _options = options;
      var project = _options.project;

      if (!project) {
        throw 'Must supply a skypager project bundle to launch this application';
      }

      /*
      if (project) {
        if (!options.setup && !project.settings.app) {
          return require('ui/applications/setup').setup(project)
        }
      }
      */

      if (options.layout && typeof options.layout === 'function') {
        options.layout = (0, _stateful2.default)(options.layout, 'settings', 'settings.navigation', 'settings.branding');
      }

      var renderer = function renderer() {
        _this2.render(options);
      };

      if (!options.defer) {
        renderer();
      }

      return renderer;
    }
  }, {
    key: 'render',
    value: function render() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var project = options.project || options.bundle;

      var props = project ? project.buildApp(options) : sanitize(options);

      var client = props.client;
      var layout = props.layout;
      var screens = props.screens;
      var middlewares = props.middlewares;
      var reducers = props.reducers;
      var initialState = props.initialState;

      if (version >= 1 && project && app && options.hot) {
        //console.log('Reloading Bundle')
        app.reloadBundle(project);
      }

      app = (0, _reactDom.render)(_react2.default.createElement(Application, { screens: screens,
        initialState: initialState,
        layout: layout,
        project: project,
        client: client,
        version: version,
        middlewares: middlewares,
        reducers: reducers, __source: {
          fileName: _jsxFileName,
          lineNumber: 123
        }
      }), document.getElementById(options.root || 'app'));

      version = version + 1;
      return app;
    }
  }]);

  function Application() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Application);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Application).call(this, props, context));

    var _this$props = _this.props;
    var layout = _this$props.layout;
    var screens = _this$props.screens;
    var _this$props2 = _this.props;
    var reducers = _this$props2.reducers;
    var middlewares = _this$props2.middlewares;
    var initialState = _this$props2.initialState;
    var project = _this$props2.project;

    _this.routes = (0, _routes.routes)(layout, { screens: screens, project: project });

    //console.log('Application Creating', props, context)

    _this.store = (0, _stores.stores)({
      reducers: reducers,
      middlewares: middlewares,
      initialState: initialState,
      history: _reactRouter.browserHistory,
      project: project
    });
    return _this;
  }

  (0, _createClass3.default)(Application, [{
    key: 'reloadBundle',
    value: function reloadBundle(project) {
      var _this3 = this;

      ['assets', 'project', 'content', 'settings', 'entities', 'models'].forEach(function (key) {
        return _this3.store.dispatch({
          type: 'REFRESH_' + key.toUpperCase(),
          payload: project[key]
        });
      });
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      var _props = this.props;
      var project = _props.project;
      var client = _props.client;

      var settings = project.settings || {};

      return {
        store: this.store,
        project: project,
        client: client,
        settings: settings
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactRouter.Router,
        { history: _reactRouter.browserHistory, __source: {
            fileName: _jsxFileName,
            lineNumber: 181
          }
        },
        this.routes
      );
    }
  }]);
  return Application;
})(_react.Component);

Application.displayName = 'Application';
Application.propTypes = {
  // an array of objects which will get merged into the rootReducer
  reducers: _react.PropTypes.arrayOf(_react.PropTypes.object),
  // an array of objects which will get merged into an initialState
  state: _react.PropTypes.arrayOf(_react.PropTypes.object),
  // the layout layout component to wrap the app in
  layout: _react.PropTypes.func,

  // entry point configuration
  screens: _react.PropTypes.object,

  // an array of redux middlewares to inject into the store
  middlewares: _react.PropTypes.array,

  project: _react.PropTypes.object,

  client: _react.PropTypes.object
};
Application.defaultProps = {
  layout: _DefaultLayout2.default
};
Application.childContextTypes = {
  client: _react.PropTypes.object,

  store: _react.PropTypes.shape({
    subscribe: _react.PropTypes.func.isRequired,
    dispatch: _react.PropTypes.func.isRequired,
    getState: _react.PropTypes.func.isRequired
  }),

  project: _react.PropTypes.object,

  settings: _react.PropTypes.object
};
Application.sanitize = sanitize;
exports.default = Application;

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function sanitize() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!options.project && options.bundle) {
    options.project = options.bundle;
    delete options.bundle;
  }

  var initialState = options.initialState = options.initialState || defaultInitialState;
  var middlewares = options.middlewares = options.middlewares || defaultMiddlewares;
  var reducers = options.reducers = options.reducers || defaultReducers;

  initialState = isArray(initialState) ? initialState : [initialState];
  reducers = isArray(reducers) ? reducers : [reducers];

  return assign({}, options);
}

var _Object = Object;
var keys = _Object.keys;
var assign = _Object.assign;