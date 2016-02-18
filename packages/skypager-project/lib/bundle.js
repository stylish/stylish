'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Consumes a Skypager Bundle Export and provides
 * a Project like interface.  It also can generate a Skypager.Application
*/
module.exports = (function () {
  (0, _createClass3.default)(Bundle, null, [{
    key: 'create',
    value: function create() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(Bundle, [null].concat(args)))();
    }
  }]);

  function Bundle(bundle) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Bundle);

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
    this.settings = bundle.settings;

    this.assetsContent = this.content.assets;
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
        return bundle.content.settings;
      },
      get assetFiles() {
        return bundle.content.assets;
      },
      get data() {
        return bundle.content.data_sources;
      }
    });

    if (options.subscribe) {
      this.setupSubscription(options.subscribe);
    }
  }

  (0, _createClass3.default)(Bundle, [{
    key: 'createApp',
    value: function createApp(appClass) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return appClass.create(buildApp(options));
    }
  }, {
    key: 'buildApp',
    value: function buildApp() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var props = this.buildStateMachine(this.buildLayout(this.buildEntryPoints(assign({}, options))));

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
      return this.require('script', 'layouts/' + id);
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
      var key = this[assetType + 's'][assetId].paths.relative;
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

      var settings = ProjectReducers.settings;

      props.reducers = props.reducers || [];
      props.initialState = props.initialState || [];

      props.reducers.push(ProjectReducers);

      props.initialState.push({
        assets: project.assets,
        content: project.content,
        entities: project.entities,
        models: project.models,
        settings: project.settings
      });

      return props;
    }
  }, {
    key: 'buildEntryPoints',
    value: function buildEntryPoints() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var project = props.project = this;
      var settings = project.settings || {};
      var app = settings.app || {};

      props.entryPoints = assign(app.entryPoints || {}, props.entryPoints || {});

      var entryPaths = keys(props.entryPoints);

      if (entryPaths.length < 1) {
        throw 'Invalid Application Settings; missing an entry point';
      }

      entryPaths.forEach(function (path) {
        var cfg = props.entryPoints[path];

        if (typeof cfg === 'string') {
          cfg = props.entryPoints[path] = {
            component: project.requireEntryPoint(cfg)
          };
        }

        if ((typeof cfg === 'undefined' ? 'undefined' : (0, _typeof3.default)(cfg)) === 'object' && typeof cfg.component === 'string') {
          cfg.component = project.requireEntryPoint(cfg.component);
        }

        if ((typeof cfg === 'undefined' ? 'undefined' : (0, _typeof3.default)(cfg)) === 'object' && cfg.index && typeof cfg.index === 'string') {
          cfg.index = project.requireEntryPoint(cfg.index);
        }

        if ((typeof cfg === 'undefined' ? 'undefined' : (0, _typeof3.default)(cfg)) === 'object' && cfg.index && (0, _typeof3.default)(cfg.index) === 'object') {
          cfg.index.component = project.requireEntryPoint(cfg.index.component);
        }
      });

      return props;
    }
  }, {
    key: 'buildLayout',
    value: function buildLayout() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var project = props.project = this;
      var settings = project.settings || {};
      var app = settings.app || {};

      props.layout = props.layout || app.layout;

      if (typeof props.layout === 'string') {
        props.layout = this.requireLayout(props.layout);
      }

      if ((0, _typeof3.default)(props.layout) === 'object') {
        if (typeof props.layout.component === 'string') {
          props.layout.component = this.requireLayout(props.layout.component);
        }
      }

      return props;
    }
  }]);
  return Bundle;
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

    if (type === 'REFRSH_MODELS') {
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