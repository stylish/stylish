'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _default_settings = require('./default_settings');

var _default_settings2 = _interopRequireDefault(_default_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_settings = (0, _default_settings2.default)({ version: 'v1' }); /**
                                                                            * Consumes a Skypager Bundle Export and provides
                                                                            * a Project like interface.  It also can generate a Skypager.Application
                                                                           */

module.exports = (function () {
  (0, _createClass3.default)(BundleWrapper, null, [{
    key: 'create',
    value: function create() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(BundleWrapper, [null].concat(args)))();
    }
  }]);

  function BundleWrapper(bundle) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, BundleWrapper);

    hide(this, {
      bundle: bundle
    });

    if (options.computed) {
      assign(this, options.computed);
    }

    var content = bundle.content || {};
    var contentCollections = keys(content);

    this.assets = bundle.assets;
    this.project = bundle.project;
    this.entities = bundle.entities;
    this.content = bundle.content;
    this.model = bundle.models;

    var settings = (0, _defaultsDeep2.default)(bundle.settings, default_settings);

    var currentApp = settings.app.current || settings.app.available[0] || default_settings.app.current || 'web';
    var app = settings.apps[currentApp] || default_settings.apps[currentApp] || default_settings.apps.web;

    this.settings = app;

    this.copy = bundle.copy && bundle.copy[currentApp] ? bundle.copy[currentApp] : bundle.copy;

    //this.assetsContent = this.content.assets
    this.settingsContent = this.content.settings;
    this.docs = this.content.documents;
    this.data = this.content.data_sources;

    this.scripts = this.content.scripts;
    this.stylesheets = this.content.stylesheets;
    this.packages = this.content.packages;
    this.projects = this.content.projects;

    this.entityNames = keys(this.entities || {});

    this.requireContexts = bundle.requireContexts;

    // naming irregularities
    assign(this, {
      get settingsFiles() {
        return bundle.content.settings_files;
      },
      get copyFiles() {
        return bundle.content.copy_files;
      },
      get data() {
        return bundle.content.data_sources;
      }
    });

    if (options.subscribe) {
      this.setupSubscription(options.subscribe);
    }
  }

  (0, _createClass3.default)(BundleWrapper, [{
    key: 'createApp',
    value: function createApp(appClass) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      appClass = appClass || require('ui/applications').Application;

      return appClass.create(this.buildApp(options));
    }
  }, {
    key: 'buildApp',
    value: function buildApp() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var props = this.buildStateMachine(this.buildLayout(this.buildScreens(options)));

      return props;
    }
  }, {
    key: 'query',
    value: function query(source, params) {
      source = ('' + source).toLowerCase();

      if (this.entityNames.indexOf(source) > 0) {
        return filterQuery(values(this.entities[source]), params);
      }
    }

    // subscribe to a notifications channel which will push updates
    // whenever the bundle changes

  }, {
    key: 'setupSubscription',
    value: function setupSubscription() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    }
  }, {
    key: 'requireEntryPoint',
    value: function requireEntryPoint(id) {
      return this.require('script', 'entries/' + id);
    }
  }, {
    key: 'requireLayout',
    value: function requireLayout(id) {
      var result = undefined;

      try {
        result = this.require('script', 'layouts/' + id);
      } catch (e) {}

      if (result) {
        return result;
      }

      console.log('Dynamic Layouts', require('ui/layouts').keys());
    }
  }, {
    key: 'requireComponent',
    value: function requireComponent(id) {
      return this.require('script', 'components/' + id);
    }
  }, {
    key: 'requireStyleSheet',
    value: function requireStyleSheet(id) {
      return this.require('stylesheet', id);
    }
  }, {
    key: 'require',
    value: function require(assetType, assetId) {
      var file = this[assetType + 's'][assetId] || this[assetType + 's'][assetId + '/index'] || this[assetType + 's'][assetId + '/' + assetId];

      if (!file) {
        console.error('Error requiring asset from require contexts', assetId, assetType);
        throw 'Error loading asset from the require context';
      }

      var key = file.paths.relative;
      var asset = this.requireContexts[assetType + 's']('./' + key);

      if (!asset) {
        throw 'Could not find ' + assetType + ' ' + assetId;
      }

      return asset.default ? asset.default : asset;
    }
  }, {
    key: 'buildStateMachine',
    value: function buildStateMachine() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var project = props.project = this;

      props.reducers = props.reducers || [];
      props.initialState = props.initialState || [];

      props.reducers.push(ProjectReducers);

      props.initialState.push({
        assets: project.assets,
        content: project.content,
        entities: project.entities,
        models: project.models,
        settings: this.settings,
        copy: this.copy
      });

      return props;
    }
  }, {
    key: 'buildScreens',
    value: function buildScreens() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var project = props.project.project;
    }
  }, {
    key: 'buildLayout',
    value: function buildLayout() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var settings = this.settings;

      props.layout = props.layout || settings.layout;

      if ((0, _isString2.default)(props.layout)) {
        try {
          props.layout = this.requireLayout(props.layout);
        } catch (error) {
          console.log('Error looking up string based layout', props.layout);
        }
      }

      if (!props.layout) {
        props.layout = require('../ui/layouts/DefaultLayout').default;
      }

      if (!props.layout) {
        console.warn('Could not auto generate a layout component');
      }

      return props;
    }
  }]);
  return BundleWrapper;
})();

function lazy(obj) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  keys(props).forEach(function (key) {
    var value = props[key];

    defineProperty(obj, key, {
      configurable: true,
      get: function get() {
        delete obj[key];
        return obj[key] = value();
      }
    });
  });
}

function hide(obj) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  keys(props).forEach(function (key) {
    var value = props[key];

    defineProperty(obj, key, {
      enumerable: false,
      value: value
    });
  });
}

function filterQuery() {
  var list = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var params = arguments[1];

  if (typeof params === 'function') {
    return list.filter(params);
  }

  return (list || []).filter(function (item) {
    return keys(params).every(function (key) {
      var param = params[key];
      var value = item[key];

      if (isRegexp(param) && param.test(value)) {
        return true;
      }

      if (typeof param === 'string' && value === param) {
        return true;
      }

      if (typeof param === 'number' && value === param) {
        return true;
      }

      // treat normal arrays to search for any exact matches
      if (isArray(param)) {
        return param.any(function (val) {
          return val === value;
        });
      }
    });
  });
}

function values(obj) {
  return keys(obj).map(function (k) {
    return obj[k];
  });
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

var ProjectReducers = {
  assets: function assets() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_ASSETS') {
      return assign(state, payload);
    }

    return state;
  },
  content: function content() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_CONTENT') {
      return assign(state, payload);
    }

    return state;
  },
  copy: function copy() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_COPY') {
      return assign(state, payload);
    }

    return state;
  },
  entities: function entities() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_ENTITIES') {
      return assign(state, payload);
    }

    return state;
  },
  models: function models() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_MODELS') {
      return assign(state, payload);
    }

    return state;
  },
  project: function project() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_PROJECT') {
      return assign(state, payload);
    }

    return state;
  },
  settings: function settings() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var payload = action.payload;
    var type = action.type;

    if (type === 'REFRESH_SETTINGS') {
      return assign(state, payload);
    }

    return state;
  }
};

function delegate(recipient) {
  for (var _len2 = arguments.length, propertyNames = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    propertyNames[_key2 - 1] = arguments[_key2];
  }

  var i = function i(source) {
    propertyNames.forEach(function (prop) {
      defineProperty(recipient, prop, {
        get: function get() {
          return source[prop];
        }
      });
    });
  };

  i.to = i;

  return i;
}

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;