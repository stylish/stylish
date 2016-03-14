'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isRegExp = require('lodash/isRegExp');

var _isRegExp2 = _interopRequireDefault(_isRegExp);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Consumes a Skypager Bundle Export and provides
 * a Project like interface.  It also can generate a Skypager.Application
*/

var default_settings = (0, _defaults2.default)({ version: 'v1' });

var cache = {
  components: {},
  layouts: {},
  screens: {},
  contexts: {},
  redux: {}
};

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

    // don't overwrite these values once set as it breaks webpacks module ids
    (0, _defaultsDeep2.default)(cache.contexts, (0, _extends3.default)({}, bundle.requireContexts));

    hide(this, {
      bundle: bundle
    });

    if (options.api) {
      assign(this, options.api);
    }

    var content = bundle.content || {};
    var contentCollections = keys(content);

    this.project = bundle.project;
    this.entities = bundle.entities;
    this.content = bundle.content;
    this.models = bundle.models;

    var settings = bundle.settings;
    var currentApp = settings.app.current || settings.app.available[0] || default_settings.app.current || 'web';
    var app = settings.apps[currentApp] || default_settings.apps[currentApp] || default_settings.apps.web;

    this.settings = app;

    this.copy = bundle.copy && bundle.copy[currentApp] ? bundle.copy[currentApp] : bundle.copy;

    //this.assetsContent = this.content.assets
    this.docs = addQuerySugar(this.content.documents);
    this.data = addQuerySugar(this.content.data_sources);
    this.scripts = addQuerySugar(this.content.scripts);

    if (options.subscribe) {
      this.setupSubscription(options.subscribe);
    }
  }

  (0, _createClass3.default)(BundleWrapper, [{
    key: 'buildApp',
    value: function buildApp() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      props = (0, _defaultsDeep2.default)(props, {
        reducers: [],
        initialState: [],
        middlewares: []
      });

      this.buildRedux(this.loadProjectReduxFiles(this.loadComponents(this.buildScreens(this.buildLayout(props)))));

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
    key: 'findComponentHandler',
    value: function findComponentHandler(assetId) {
      var scripts = this.scripts || {};

      return scripts['components/' + assetId] || scripts['components/' + assetId + '/index'];
    }
  }, {
    key: 'findLayoutHandler',
    value: function findLayoutHandler(assetId) {
      var scripts = this.scripts || {};

      return scripts['layouts/' + assetId] || scripts['layouts/' + assetId + '/index'] || scripts['components/' + assetId] || scripts['components/' + assetId + '/index'];
    }
  }, {
    key: 'findLayoutHandler',
    value: function findLayoutHandler(assetId) {
      var scripts = this.scripts || {};

      return scripts['layouts/' + assetId] || scripts['layouts/' + assetId + '/index'] || scripts['components/' + assetId] || scripts['components/' + assetId + '/index'];
    }
  }, {
    key: 'findScreenHandler',
    value: function findScreenHandler(assetId) {
      var scripts = this.scripts || {};

      return scripts['entries/' + assetId] || scripts['entries/' + assetId + '/index'] || scripts['entries/' + assetId + '/components/' + assetId] || scripts['entries/' + assetId + '/components/' + assetId + '/index'] || scripts['components/' + assetId] || scripts['components/' + assetId + '/index'];
    }
  }, {
    key: 'validateScreenReference',
    value: function validateScreenReference(assetId) {
      return !!this.findScreenHandler(assetId);
    }
  }, {
    key: 'requireComponent',
    value: function requireComponent(assetId) {
      return cache.components[assetId] || _requireComponent.call(this, assetId);
    }
  }, {
    key: 'requireLayout',
    value: function requireLayout(assetId) {
      return cache.layouts[assetId] || _requireLayout.call(this, assetId);
    }
  }, {
    key: 'requireScreen',
    value: function requireScreen(assetId) {
      return cache.screens[assetId] || _requireScreen.call(this, assetId);
    }
  }, {
    key: 'requireStateConfig',
    value: function requireStateConfig(assetId) {
      return cache.redux[assetId] || _requireStateConfig.call(this, assetId);
    }
  }, {
    key: 'require',
    value: function require(assetType, assetId) {
      var base = this[assetType + 's'];

      var file = base[assetId] || base[assetId + '/index'] || base[assetId + '/' + assetId];

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
    key: 'buildRedux',
    value: function buildRedux(props) {
      var project = this;

      props.reducers.push((0, _pick2.default)(ProjectReducers, 'copy', 'settings', 'entities'));

      // TODO
      // This should be controllable via project settings
      // not every app needs all of this stuff loaded in redux
      props.initialState.push({
        copy: project.copy,
        settings: project.settings,
        entities: project.entities
      });

      return props;
    }

    /**
     * this is an attempt to lock a webpack module id down
     * and don't hot reload it when we hot reload the bundle
     */

  }, {
    key: 'loadComponents',
    value: function loadComponents() {
      var _this = this;

      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      props.layout = this.requireLayout(props.layout);

      props.screens = (0, _mapValues2.default)(this.settings.screens, function (id) {
        return _this.requireScreen(id);
      });

      return props;
    }
  }, {
    key: 'loadProjectReduxFiles',
    value: function loadProjectReduxFiles(props) {
      var _this2 = this;

      (0, _mapValues2.default)(this.settings.screens, function (screenId) {
        var base = _this2.findScreenHandler(screenId).id;

        if (_this2.scripts[base + '/state']) {
          var stateConfig = _this2.requireStateConfig.call(_this2, '' + base);

          if (stateConfig && stateConfig.reducers) {
            props.reducers.push(stateConfig.reducers);
          }

          if (stateConfig && stateConfig.initialState) {
            props.initialState.push(stateConfig.initialState);
          }
        }
      });

      return props;
    }
  }, {
    key: 'buildScreens',
    value: function buildScreens(props) {
      props.screens = this.settings.screens;
      return props;
    }
  }, {
    key: 'buildLayout',
    value: function buildLayout(props) {
      props.layout = this.settings.layout;
      return props;
    }
  }, {
    key: 'entityNames',
    get: function get() {
      return keys(this.entities);
    }
  }, {
    key: 'requireContexts',
    get: function get() {
      return cache.contexts;
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

  return obj;
}

function addQuerySugar(object) {
  hide(object, {
    query: function query() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return filterQuery.apply(undefined, [values(object)].concat(args));
    },
    where: function where() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return addQuerySugar(_pickBy3.default.apply(undefined, [object].concat(args)));
    },
    pickBy: function pickBy() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return addQuerySugar(_pickBy3.default.apply(undefined, [object].concat(args)));
    },
    sortBy: (function (_sortBy) {
      function sortBy() {
        return _sortBy.apply(this, arguments);
      }

      sortBy.toString = function () {
        return _sortBy.toString();
      };

      return sortBy;
    })(function () {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return sortBy.apply(undefined, [values(object)].concat(args));
    })
  });

  return object;
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

      if ((0, _isRegExp2.default)(param) && param.test(value)) {
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
        return param.filter(function (val) {
          return val === value;
        }).length > 0;
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
  for (var _len6 = arguments.length, propertyNames = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    propertyNames[_key6 - 1] = arguments[_key6];
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

function _requireStateConfig(screenId) {
  return cache.redux[screenId] = cache.redux[screenId] || this.require('script', screenId + '/state');
}

function _requireScreen(screenId) {
  var handler = this.findScreenHandler(screenId);
  var relativePath = handler && handler.paths.relative;

  if (!relativePath) {
    throw 'Failed to find screen via: ' + screenId;
  }

  var asset = this.requireContexts.scripts('./' + relativePath);

  if (!asset) {
    throw 'Failed to require screen via context: ' + screenId;
  }

  return asset.default ? asset.default : asset;
}

function _requireComponent(componentId) {
  var handler = this.findComponentHandler(componentId);
  var relativePath = handler && handler.paths.relative;

  if (!relativePath) {
    throw 'Failed to find component handler via: ' + componentId;
  }

  var asset = this.requireContexts.scripts('./' + relativePath);

  if (!asset) {
    throw 'Failed to require component via context: ' + componentId;
  }

  return asset.default ? asset.default : asset;
}

function _requireLayout(componentId) {
  var handler = this.findLayoutHandler(componentId);
  var relativePath = handler && handler.paths.relative;

  if (!relativePath) {
    throw 'Failed to find layout handler via: ' + componentId;
  }

  var asset = this.requireContexts.scripts('./' + relativePath);

  if (!asset) {
    throw 'Failed to require layout via context: ' + componentId;
  }

  return asset.default ? asset.default : asset;
}

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;