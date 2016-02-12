'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginDefinition = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tracker = {};
var _curr = undefined;

function current() {
  var clear = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

  var c = tracker[_curr];

  if (clear) {
    delete tracker[_curr];
  }

  return c;
}

var PluginDefinition = exports.PluginDefinition = (function () {
  function PluginDefinition(pluginName) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, PluginDefinition);

    this.name = pluginName;

    this.config = {
      aliases: [],
      dependencies: [],
      modifiers: [],
      provides: {},
      supportChecker: function supportChecker() {
        return true;
      }
    };

    this.version = '0.0.1';
  }

  (0, _createClass3.default)(PluginDefinition, [{
    key: 'provides',

    /**
    * What does this plugin provide? Valid options are:
    * - helpers: action, exporter, importer, model, view, store
    * - configuration: additions to the configuration schema
    */
    value: function provides(what, value) {
      if ((typeof what === 'undefined' ? 'undefined' : (0, _typeof3.default)(what)) === 'object' && !value) {
        return this.config.provides = (0, _assign2.default)(this.config.provides, what);
      }

      if (value) {
        this.config.provides[what] = value;
      }

      return this.config.provides[what];
    }
  }, {
    key: 'runner',
    value: function runner() {
      var _config;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if ((_config = this.config).supportChecker.apply(_config, args)) {
        this.modifiers.forEach(function (fn) {
          return fn.apply(undefined, args);
        });
      }
    }
  }, {
    key: 'aka',
    value: function aka() {
      for (var _len2 = arguments.length, list = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        list[_key2] = arguments[_key2];
      }

      this.config.aliases = this.config.aliases.concat(list);
    }
  }, {
    key: 'aliases',
    value: function aliases() {
      this.aka.apply(this, arguments);
    }
  }, {
    key: 'dependencies',
    value: function dependencies() {
      for (var _len3 = arguments.length, list = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        list[_key3] = arguments[_key3];
      }

      this.config.dependencies = this.config.dependencies.concat(list);
    }
  }, {
    key: 'modify',
    value: function modify() {
      for (var _len4 = arguments.length, modifiers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        modifiers[_key4] = arguments[_key4];
      }

      this.config.modifiers = this.config.modifiers.concat(modifiers);
    }
  }, {
    key: 'isSupported',
    value: function isSupported(fn) {
      this.config.supportChecker = fn;
    }
  }, {
    key: 'api',
    get: function get() {
      return {
        name: this.name,
        aliases: this.config.aliases,
        dependencies: this.config.dependencies,
        modifiers: this.config.modifiers,
        modify: this.config.modifiers[0],
        version: this.version,
        runner: this.runner,
        provides: this.provides
      };
    }
  }]);
  return PluginDefinition;
})();

PluginDefinition.current = current;
PluginDefinition.clearDefinition = function () {
  current(true);
};

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

function lookup(pluginName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(pluginName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  plugin: function plugin(pluginName) {
    tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(pluginName))] = new PluginDefinition(pluginName);
  },
  aliases: function aliases() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).aliases.apply(_tracker$_curr, arguments);
  },
  aka: function aka() {
    var _tracker$_curr2;

    (_tracker$_curr2 = tracker[_curr]).aka.apply(_tracker$_curr2, arguments);
  },
  dependencies: function dependencies() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).dependencies.apply(_tracker$_curr3, arguments);
  },
  isSupported: function isSupported() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).isSupported.apply(_tracker$_curr4, arguments);
  },
  modify: function modify() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).modify.apply(_tracker$_curr5, arguments);
  }
});