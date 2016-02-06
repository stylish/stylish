'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionDefinition = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tracker = {};
var _curr = undefined;

function current() {
  return tracker[_curr];
}
function clearDefinition() {
  _curr = null;delete tracker[_curr];
}

var ActionDefinition = exports.ActionDefinition = (function () {
  function ActionDefinition(actionName) {
    (0, _classCallCheck3.default)(this, ActionDefinition);

    this.name = actionName;
    this.description = '';
    this.config = {};
    this.interfaces = {};
    this.parameters = {};
    this.aliases = {};
    this.validator = function () {
      return true;
    };
    this.executor = function () {
      throw 'Define your own executor function';
    };
  }

  (0, _createClass3.default)(ActionDefinition, [{
    key: 'describe',
    value: function describe(value) {
      this.description = value;
    }
  }, {
    key: 'expose',
    value: function expose(platform, configurator) {
      this.interfaces[platform] = configurator;
    }
  }, {
    key: 'aka',
    value: function aka() {
      var _this = this;

      for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
        list[_key] = arguments[_key];
      }

      list.forEach(function (alias) {
        _this.aliases[(0, _util.parameterize)((0, _util.underscore)(alias.toLowerCase()))] = true;
      });
    }
  }, {
    key: 'aliases',
    value: function aliases() {
      this.aka.apply(this, arguments);
    }
  }, {
    key: 'params',
    value: function params() {
      this.configureParameters.apply(this, arguments);
    }
  }, {
    key: 'validate',
    value: function validate(fn) {
      this.validator = fn;
    }
  }, {
    key: 'execute',
    value: function execute(fn) {
      this.executor = fn;
    }
  }, {
    key: 'configureParameters',
    value: function configureParameters(inputs) {}
  }, {
    key: 'api',
    get: function get() {
      var def = this;

      return {
        name: this.name,
        aliases: this.aliases,
        execute: this.executor,
        validate: this.validator,
        parameters: this.parameters,
        runner: function runner(params, action) {
          if (def.api.validate(params, action)) {
            return def.api.execute(params, action);
          }
        }
      };
    }
  }]);
  return ActionDefinition;
})();

ActionDefinition.current = current;
ActionDefinition.clearDefinition = clearDefinition;

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

function lookup(actionName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(actionName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  action: function action(actionName) {
    tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(actionName))] = new ActionDefinition(actionName);
  },
  describe: function describe() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).describe.apply(_tracker$_curr, arguments);
  },
  aliases: function aliases() {
    var _tracker$_curr2;

    (_tracker$_curr2 = tracker[_curr]).aliases.apply(_tracker$_curr2, arguments);
  },
  aka: function aka() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).aka.apply(_tracker$_curr3, arguments);
  },
  validate: function validate() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).validate.apply(_tracker$_curr4, arguments);
  },
  execute: function execute() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).execute.apply(_tracker$_curr5, arguments);
  },
  required: function required() {
    var _tracker$_curr6;

    (_tracker$_curr6 = tracker[_curr]).required.apply(_tracker$_curr6, arguments);
  },
  optional: function optional() {
    var _tracker$_curr7;

    (_tracker$_curr7 = tracker[_curr]).optional.apply(_tracker$_curr7, arguments);
  },
  params: function params() {
    var _tracker$_curr8;

    (_tracker$_curr8 = tracker[_curr]).params.apply(_tracker$_curr8, arguments);
  },
  expose: function expose() {
    var _tracker$_curr9;

    (_tracker$_curr9 = tracker[_curr]).expose.apply(_tracker$_curr9, arguments);
  },
  cli: function cli() {
    var _tracker$_curr10;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    (_tracker$_curr10 = tracker[_curr]).expose.apply(_tracker$_curr10, ['cli'].concat(args));
  },
  ipc: function ipc() {
    var _tracker$_curr11;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    (_tracker$_curr11 = tracker[_curr]).expose.apply(_tracker$_curr11, ['ipc'].concat(args));
  },
  web: function web() {
    var _tracker$_curr12;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    (_tracker$_curr12 = tracker[_curr]).expose.apply(_tracker$_curr12, ['web'].concat(args));
  }
});