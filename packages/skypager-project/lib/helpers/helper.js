'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

var _path = require('path');

var _fbemitter = require('fbemitter');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Skypager.Helper
 *
 * The Skypager.Helper is a way of specifying the interface and behavior of
 * different categories of javascript modules used by the project.  The different
 * categories of modules such as Actions or Models can provide their own DSLs through
 * the helper system.
*/

var Helper = (function (_EventEmitter) {
  (0, _inherits3.default)(Helper, _EventEmitter);
  (0, _createClass3.default)(Helper, null, [{
    key: 'decorateRegistry',
    value: function decorateRegistry(registry) {
      if (this.registryInterface) {
        defineProperties(registry, this.registryInterface(registry));
      }
    }

    /*
    * Creates a Helper from a Definition object that was
    * created by a required' script file from one of the dedicated
    * locations for the type of helper.
    */

  }, {
    key: 'fromDefinition',
    value: function fromDefinition(uri, definition, options) {
      if (definition && options.required) {
        Object.defineProperty(definition, 'helperExport', {
          enumerable: false,
          get: function get() {
            return options.required;
          }
        });
      }

      var helper = new this(uri, (0, _assign2.default)(options, { definition: definition }));

      (0, _defineProperties2.default)(definition, {
        _helper: {
          enumerable: false,
          get: function get() {
            return helper;
          }
        },
        _requirePath: {
          enumerable: false,
          get: function get() {
            return uri;
          }
        }
      });

      return helper;
    }
  }]);

  function Helper(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Helper);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Helper).call(this));

    var helper = _this;
    var raw = undefined;

    util.assign(_this, {
      get raw() {
        return raw;
      },

      set raw(val) {
        raw = val;
        //helper.contentDidChange(helper)
      }
    });

    _this.hidden('uri', uri);
    _this.hidden('options', options);
    _this.hidden('project', function () {
      return options.project;
    });
    _this.getter('owner', function () {
      return options.owner;
    });
    _this.getter('required', function () {
      return options.required || _this.require(uri);
    }, true);

    var definition = options.definition;

    // before returning the definition make sure to call any configure methods we have
    _this.getter('definition', function () {
      var _this2 = this;

      var d = options.definition || this.required.definition;

      if (d && d.configure) {
        d.configure();
      }

      if (this.required && this.required.config) {
        (0, _keys2.default)(this.required.config).forEach(function (key) {
          if (d && d.config && d.config[key]) {
            d.config[key] = (0, _assign2.default)(_this2.required.config[key], d.config[key]);
          } else {
            d.config[key] = _this2.required.config[key];
          }
        });
      }

      return d;
    });

    _this.id = _this.paths.relative.replace(_this.extension, '');

    _this.hidden('api', function () {
      return _this.buildAPI(options.api, _this.required);
    });
    return _this;
  }

  /**
   * creates a subscription to an event
   * 
   * @param String event name of the event to monitor
   * @Param function callback callback to execute when event occurs
   */

  (0, _createClass3.default)(Helper, [{
    key: 'on',
    value: function on(event, callback) {
      return this.addListener(event, callback);
    }

    //TODO: implement
    //see https://github.com/facebook/emitter#__emittosubscriptionsubscription-eventtype-args
    //__emitToSubscription(subscription, eventType, ...args) {}

  }, {
    key: 'result',
    value: function result() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return util.result.apply(util, [this].concat(args));
    }
    /**
    * Every helper should expose an api with a function which is responsible
    * for handling calls to the run function that get dispatched to the helper.
    *
    */

  }, {
    key: 'run',
    value: function run() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var project = options.project || context.project || this.project;
      var fn = project ? this.runner.bind(project) : this.runner;

      return util.noConflict(function () {
        return fn(options, context);
      }, {
        project: project,
        skypager: _index2.default,
        util: util,
        currentHelper: this
      })();
    }
  }, {
    key: 'hidden',
    value: function hidden() {
      var _util$hidden;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_util$hidden = util.hidden).getter.apply(_util$hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return util.lazy.apply(util, [this].concat(args));
    }
  }, {
    key: 'buildAPI',
    value: function buildAPI(api) {
      if (api) {
        return api;
      }

      var mod = this.required;

      var runner = undefined;

      // if this helper module exported a function
      if (typeof mod === 'function') {
        runner = this.project ? mod.bind(this.project) : mod;

        return (0, _assign2.default)(runner, {
          runner: runner,
          id: this.id,
          definition: this.definition
        });
      }

      if ((typeof mod === 'undefined' ? 'undefined' : (0, _typeof3.default)(mod)) === 'object' && typeof mod.default === 'function') {
        return (0, _assign2.default)(mod, {
          runner: this.project ? mod.default.bind(this.project) : mod.default,
          id: this.id,
          definition: this.definition
        });
      }

      if ((typeof mod === 'undefined' ? 'undefined' : (0, _typeof3.default)(mod)) === 'object') {
        return (0, _assign2.default)(this.definition.api || {}, mod);
      }

      throw 'There was a problem building an API for the helper id: ' + this.id + ' at ' + this.uri;
    }
  }, {
    key: 'require',
    value: function require(uri) {
      var result = module.require(uri);
      return result;
    }
  }, {
    key: 'contentWillChange',
    value: function contentWillChange(oldContent, newContent) {}
  }, {
    key: 'contentDidChange',
    value: function contentDidChange(asset) {}
  }, {
    key: 'getter',
    value: function getter(name, obj, configurable) {
      util.hide.getter(this, name, obj, configurable);
    }
  }, {
    key: 'idPath',
    get: function get() {
      return this.id.replace('-', '_').replace('/', '.');
    }
  }, {
    key: 'runner',
    get: function get() {
      return this.api.runner;
    }
  }, {
    key: 'paths',
    get: function get() {
      var asset = this;
      return {
        get summary() {
          var parts = asset.uri.split(/\/|\\/);
          return parts.reverse().slice(0, 3).reverse().join('/');
        },
        get relative() {
          return asset.uri.replace(asset.owner.root + '/', '');
        },
        get absolute() {
          return (0, _path.resolve)(asset.uri);
        }
      };
    }
  }, {
    key: 'extension',
    get: function get() {
      return (0, _path.extname)(this.uri);
    }
  }]);
  return Helper;
})(_fbemitter.EventEmitter);

exports.default = Helper;

Helper.apiMethods = [];

var _Object = Object;
var defineProperties = _Object.defineProperties;