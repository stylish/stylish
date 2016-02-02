'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Consumes a Skypager Bundle Export and provides
 * a Project like interface.  It also can generate a Skypager.Application
*/
module.exports = (function () {
  _createClass(Bundle, null, [{
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

    _classCallCheck(this, Bundle);

    hide(this, {
      bundle: bundle
    });

    if (options.computed) {
      assign(this, options.computed);
    }

    this.assets = this.bundle.assets;
    this.content = this.bundle.content;
    this.docs = this.content.docs;
    this.data = this.content.data_sources;
    this.entities = this.bundle.entities;
    this.models = this.bundle.models;
    this.project = this.bundle.project;
    this.settings = this.data.settings && this.data.settings.data || {};
    this.entityNames = keys(this.entities || {});
  }

  _createClass(Bundle, [{
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
      var key = this.content[assetType + 's'][assetId].paths.relative;

      var mod = this.bundle.requireContexts[assetType + 's']('./' + key);

      if (!mod) {
        throw 'Could not find ' + assetType + ' ' + assetId;
      }

      return mod.default ? mod.default : mod;
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

        if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) === 'object' && typeof cfg.component === 'string') {
          cfg.component = project.requireEntryPoint(cfg.component);
        }

        if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) === 'object' && cfg.index && typeof cfg.index === 'string') {
          cfg.index = project.requireEntryPoint(cfg.index);
        }

        if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) === 'object' && cfg.index && _typeof(cfg.index) === 'object') {
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

      if (_typeof(props.layout) === 'object') {
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

      if (isRegex(param) && param.test(value)) {
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

function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && Object.getPrototypeOf(val).toString() === '/(?:)/') {
    return true;
  }

  return false;
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

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;
//# sourceMappingURL=data:application/json;base64,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ZGxlIEV4cG9ydCBhbmQgcHJvdmlkZXNcbiAqIGEgUHJvamVjdCBsaWtlIGludGVyZmFjZS4gIEl0IGFsc28gY2FuIGdlbmVyYXRlIGEgU2t5cGFnZXIuQXBwbGljYXRpb25cbiovXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIEJ1bmRsZSB7XG4gIHN0YXRpYyBjcmVhdGUoLi4uYXJncykge1xuICAgIHJldHVybiBuZXcgQnVuZGxlKC4uLmFyZ3MpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoYnVuZGxlLCBvcHRpb25zID0ge30pIHtcbiAgICBoaWRlKHRoaXMsIHtcbiAgICAgIGJ1bmRsZVxuICAgIH0pXG5cbiAgICBpZiAob3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgYXNzaWduKHRoaXMsIG9wdGlvbnMuY29tcHV0ZWQpXG4gICAgfVxuXG4gICAgdGhpcy5hc3NldHMgPSB0aGlzLmJ1bmRsZS5hc3NldHNcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmJ1bmRsZS5jb250ZW50XG4gICAgdGhpcy5kb2NzID0gdGhpcy5jb250ZW50LmRvY3NcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gICAgdGhpcy5lbnRpdGllcyA9IHRoaXMuYnVuZGxlLmVudGl0aWVzXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLmJ1bmRsZS5tb2RlbHNcbiAgICB0aGlzLnByb2plY3QgPSB0aGlzLmJ1bmRsZS5wcm9qZWN0XG4gICAgdGhpcy5zZXR0aW5ncyA9ICh0aGlzLmRhdGEuc2V0dGluZ3MgJiYgdGhpcy5kYXRhLnNldHRpbmdzLmRhdGEpIHx8IHt9XG4gICAgdGhpcy5lbnRpdHlOYW1lcyA9IGtleXModGhpcy5lbnRpdGllcyB8fCB7fSlcbiAgfVxuXG4gIGNyZWF0ZUFwcChhcHBDbGFzcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIGFwcENsYXNzLmNyZWF0ZShidWlsZEFwcChvcHRpb25zKSlcbiAgfVxuXG4gIGJ1aWxkQXBwIChvcHRpb25zID0ge30pIHtcbiAgICBsZXQgcHJvcHMgPVxuXG4gICAgdGhpcy5idWlsZFN0YXRlTWFjaGluZShcbiAgICAgIHRoaXMuYnVpbGRMYXlvdXQoXG4gICAgICAgIHRoaXMuYnVpbGRFbnRyeVBvaW50cyhcbiAgICAgICAgICBhc3NpZ24oe30sIG9wdGlvbnMpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbiAgICByZXR1cm4gcHJvcHNcbiAgfVxuXG4gIHF1ZXJ5IChzb3VyY2UsIHBhcmFtcykge1xuICAgIHNvdXJjZSA9IGAkeyBzb3VyY2UgfWAudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKHRoaXMuZW50aXR5TmFtZXMuaW5kZXhPZihzb3VyY2UpID4gMCkge1xuICAgICAgcmV0dXJuIGZpbHRlclF1ZXJ5KHZhbHVlcyh0aGlzLmVudGl0aWVzW3NvdXJjZV0pLCBwYXJhbXMpXG4gICAgfVxuICB9XG5cbiAgcmVxdWlyZUVudHJ5UG9pbnQgKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWlyZSgnc2NyaXB0JywgYGVudHJpZXMvJHsgaWQgfWApXG4gIH1cblxuICByZXF1aXJlTGF5b3V0IChpZCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmUoJ3NjcmlwdCcsIGBsYXlvdXRzLyR7IGlkIH1gKVxuICB9XG5cbiAgcmVxdWlyZUNvbXBvbmVudCAoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1aXJlKCdzY3JpcHQnLCBgY29tcG9uZW50cy8keyBpZCB9YClcbiAgfVxuXG4gIHJlcXVpcmVTdHlsZVNoZWV0IChpZCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmUoJ3N0eWxlc2hlZXQnLCBpZClcbiAgfVxuXG4gIHJlcXVpcmUoYXNzZXRUeXBlLCBhc3NldElkKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuY29udGVudFthc3NldFR5cGUgKyAncyddW2Fzc2V0SWRdLnBhdGhzLnJlbGF0aXZlXG5cbiAgICBsZXQgbW9kID0gdGhpcy5idW5kbGUucmVxdWlyZUNvbnRleHRzW2Fzc2V0VHlwZSArICdzJ10oYC4vJHsga2V5IH1gKVxuXG4gICAgaWYgKCFtb2QpIHtcbiAgICAgICB0aHJvdygnQ291bGQgbm90IGZpbmQgJyArIGFzc2V0VHlwZSArICcgJyArIGFzc2V0SWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZC5kZWZhdWx0ID8gbW9kLmRlZmF1bHQgOiBtb2RcbiAgfVxuXG5cbiAgYnVpbGRTdGF0ZU1hY2hpbmUgKHByb3BzID0ge30pIHtcbiAgICBsZXQgcHJvamVjdCA9IHByb3BzLnByb2plY3QgPSB0aGlzXG5cbiAgICBsZXQgeyBzZXR0aW5ncyB9ID0gUHJvamVjdFJlZHVjZXJzXG5cbiAgICBwcm9wcy5yZWR1Y2VycyA9IHByb3BzLnJlZHVjZXJzIHx8IFtdXG4gICAgcHJvcHMuaW5pdGlhbFN0YXRlID0gcHJvcHMuaW5pdGlhbFN0YXRlIHx8IFtdXG5cbiAgICBwcm9wcy5yZWR1Y2Vycy5wdXNoKFByb2plY3RSZWR1Y2VycylcblxuICAgIHByb3BzLmluaXRpYWxTdGF0ZS5wdXNoKHtcbiAgICAgIGFzc2V0czogcHJvamVjdC5hc3NldHMsXG4gICAgICBjb250ZW50OiBwcm9qZWN0LmNvbnRlbnQsXG4gICAgICBlbnRpdGllczogcHJvamVjdC5lbnRpdGllcyxcbiAgICAgIG1vZGVsczogcHJvamVjdC5tb2RlbHMsXG4gICAgICBzZXR0aW5nczogcHJvamVjdC5zZXR0aW5nc1xuICAgIH0pXG5cbiAgICByZXR1cm4gcHJvcHNcbiAgfVxuXG4gIGJ1aWxkRW50cnlQb2ludHMgKHByb3BzID0ge30pIHtcbiAgICBsZXQgcHJvamVjdCA9IHByb3BzLnByb2plY3QgPSB0aGlzXG4gICAgbGV0IHNldHRpbmdzID0gcHJvamVjdC5zZXR0aW5ncyB8fCB7fVxuICAgIGxldCBhcHAgPSBzZXR0aW5ncy5hcHAgfHwge31cblxuICAgIHByb3BzLmVudHJ5UG9pbnRzID0gYXNzaWduKGFwcC5lbnRyeVBvaW50cyB8fCB7fSwgcHJvcHMuZW50cnlQb2ludHMgfHwge30pXG5cbiAgICBsZXQgZW50cnlQYXRocyA9IGtleXMocHJvcHMuZW50cnlQb2ludHMpXG5cbiAgICBpZiAoZW50cnlQYXRocy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdygnSW52YWxpZCBBcHBsaWNhdGlvbiBTZXR0aW5nczsgbWlzc2luZyBhbiBlbnRyeSBwb2ludCcpXG4gICAgfVxuXG4gICAgZW50cnlQYXRocy5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgbGV0IGNmZyA9IHByb3BzLmVudHJ5UG9pbnRzW3BhdGhdXG5cbiAgICAgIGlmICh0eXBlb2YgY2ZnID09PSAnc3RyaW5nJykge1xuICAgICAgICBjZmcgPSBwcm9wcy5lbnRyeVBvaW50c1twYXRoXSA9IHtcbiAgICAgICAgICBjb21wb25lbnQ6IHByb2plY3QucmVxdWlyZUVudHJ5UG9pbnQoY2ZnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgY2ZnID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgY2ZnLmNvbXBvbmVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIGNmZy5jb21wb25lbnQgPSBwcm9qZWN0LnJlcXVpcmVFbnRyeVBvaW50KGNmZy5jb21wb25lbnQpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgY2ZnID09PSAnb2JqZWN0JyAmJiBjZmcuaW5kZXggJiYgdHlwZW9mIGNmZy5pbmRleCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIGNmZy5pbmRleCA9IHByb2plY3QucmVxdWlyZUVudHJ5UG9pbnQoY2ZnLmluZGV4KVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGNmZyA9PT0gJ29iamVjdCcgJiYgY2ZnLmluZGV4ICYmIHR5cGVvZiBjZmcuaW5kZXggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICBjZmcuaW5kZXguY29tcG9uZW50ID0gcHJvamVjdC5yZXF1aXJlRW50cnlQb2ludChjZmcuaW5kZXguY29tcG9uZW50KVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIHJldHVybiBwcm9wc1xuICB9XG5cbiAgYnVpbGRMYXlvdXQgKHByb3BzID0ge30pIHtcbiAgICBsZXQgcHJvamVjdCA9IHByb3BzLnByb2plY3QgPSB0aGlzXG4gICAgbGV0IHNldHRpbmdzID0gcHJvamVjdC5zZXR0aW5ncyB8fCB7fVxuICAgIGxldCBhcHAgPSBzZXR0aW5ncy5hcHAgfHwge31cblxuICAgIHByb3BzLmxheW91dCA9IHByb3BzLmxheW91dCB8fCBhcHAubGF5b3V0XG5cbiAgICBpZiAodHlwZW9mIHByb3BzLmxheW91dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICBwcm9wcy5sYXlvdXQgPSB0aGlzLnJlcXVpcmVMYXlvdXQocHJvcHMubGF5b3V0KVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcHMubGF5b3V0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHR5cGVvZiBwcm9wcy5sYXlvdXQuY29tcG9uZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBwcm9wcy5sYXlvdXQuY29tcG9uZW50ID0gdGhpcy5yZXF1aXJlTGF5b3V0KHByb3BzLmxheW91dC5jb21wb25lbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3BzXG4gIH1cblxufVxuXG5mdW5jdGlvbiBsYXp5KG9iaiwgcHJvcHMgPSB7fSkge1xuICBrZXlzKHByb3BzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgbGV0IHZhbHVlID0gcHJvcHNba2V5XVxuXG4gICAgZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldXG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlKClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBoaWRlKG9iaiwgcHJvcHMgPSB7fSkge1xuICBrZXlzKHByb3BzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgbGV0IHZhbHVlID0gcHJvcHNba2V5XVxuXG4gICAgZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWVcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJRdWVyeSAobGlzdCA9IFtdLCBwYXJhbXMpIHtcbiAgaWYgKCB0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiBsaXN0LmZpbHRlcihwYXJhbXMpXG4gIH1cblxuICByZXR1cm4gKGxpc3QgfHwgW10pLmZpbHRlcihpdGVtID0+IHtcbiAgICByZXR1cm4ga2V5cyhwYXJhbXMpLmV2ZXJ5KGtleSA9PiB7XG4gICAgICBsZXQgcGFyYW0gPSBwYXJhbXNba2V5XVxuICAgICAgbGV0IHZhbHVlID0gaXRlbVtrZXldXG5cbiAgICAgIGlmIChpc1JlZ2V4KHBhcmFtKSAmJiBwYXJhbS50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIChwYXJhbSk9PT0nc3RyaW5nJyAmJiB2YWx1ZSA9PT0gcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiAocGFyYW0pPT09J251bWJlcicgJiYgdmFsdWUgPT09IHBhcmFtKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHRyZWF0IG5vcm1hbCBhcnJheXMgdG8gc2VhcmNoIGZvciBhbnkgZXhhY3QgbWF0Y2hlc1xuICAgICAgaWYgKGlzQXJyYXkocGFyYW0pKSB7XG4gICAgICAgIHJldHVybiBwYXJhbS5hbnkodmFsID0+IHZhbCA9PT0gdmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gdmFsdWVzKG9iaikge1xuICAgcmV0dXJuIGtleXMob2JqKS5tYXAoayA9PiBvYmpba10pXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xufVxuXG5mdW5jdGlvbiBpc1JlZ2V4KHZhbCkge1xuICBpZiAoKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiB0eXBlb2YodmFsKSkgPT09ICdvYmplY3QnICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpLnRvU3RyaW5nKCkgPT09ICcvKD86KS8nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IFByb2plY3RSZWR1Y2VycyA9IHtcbiAgYXNzZXRzIChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkge1xuICAgIGxldCB7IHBheWxvYWQsIHR5cGUgfSA9IGFjdGlvblxuXG4gICAgaWYgKHR5cGUgPT09ICdSRUZSRVNIX0FTU0VUUycpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oc3RhdGUsIHBheWxvYWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlXG4gIH0sXG5cbiAgY29udGVudCAoc3RhdGUgPSB7fSwgYWN0aW9uID0ge30pIHtcbiAgICBsZXQgeyBwYXlsb2FkLCB0eXBlIH0gPSBhY3Rpb25cblxuICAgIGlmICh0eXBlID09PSAnUkVGUkVTSF9DT05URU5UJykge1xuICAgICAgcmV0dXJuIGFzc2lnbihzdGF0ZSwgcGF5bG9hZClcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICBlbnRpdGllcyAoc3RhdGUgPSB7fSwgYWN0aW9uID0ge30pIHtcbiAgICBsZXQgeyBwYXlsb2FkLCB0eXBlIH0gPSBhY3Rpb25cblxuICAgIGlmICh0eXBlID09PSAnUkVGUkVTSF9FTlRJVElFUycpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oc3RhdGUsIHBheWxvYWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlXG4gIH0sXG5cbiAgbW9kZWxzIChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkge1xuICAgIGxldCB7IHBheWxvYWQsIHR5cGUgfSA9IGFjdGlvblxuXG4gICAgaWYgKHR5cGUgPT09ICdSRUZSU0hfTU9ERUxTJykge1xuICAgICAgcmV0dXJuIGFzc2lnbihzdGF0ZSwgcGF5bG9hZClcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICBwcm9qZWN0IChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkge1xuICAgIGxldCB7IHBheWxvYWQsIHR5cGUgfSA9IGFjdGlvblxuXG4gICAgaWYgKHR5cGUgPT09ICdSRUZSRVNIX1BST0pFQ1QnKSB7XG4gICAgICByZXR1cm4gYXNzaWduKHN0YXRlLCBwYXlsb2FkKVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG4gIHNldHRpbmdzIChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkge1xuICAgIGxldCB7IHBheWxvYWQsIHR5cGUgfSA9IGFjdGlvblxuXG4gICAgaWYgKHR5cGUgPT09ICdSRUZSRVNIX1NFVFRJTkdTJykge1xuICAgICAgcmV0dXJuIGFzc2lnbihzdGF0ZSwgcGF5bG9hZClcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxufVxuXG5jb25zdCB7IGRlZmluZVByb3BlcnR5LCBrZXlzLCBhc3NpZ24gfSA9IE9iamVjdFxuIl19