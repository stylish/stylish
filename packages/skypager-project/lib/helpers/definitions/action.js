'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionDefinition = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = require('path-match')({
  sensitive: false,
  strict: false,
  end: false
});

var tracker = {};
var _curr = undefined;

function current() {
  return tracker[_curr];
}
function clearDefinition() {
  _curr = null;delete tracker[_curr];
}

/**
 * An ActionDefinition is created automatically when an action file is loaded
 * by the actions registry.  A standard action file starts with:
 *
 * @example
 *
 *  action('MyAction')
 *
 *  execute(function(params = {}, context = {project}){
 *
 *  })
 */

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
    this.config.pathMatchers = [];
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
    key: 'addCommandPhrase',
    value: function addCommandPhrase(phrase) {
      this.config.pathMatchers.push(route(phrase.trim().replace(/\s/g, '/')));
    }
  }, {
    key: 'addRouteMatcher',
    value: function addRouteMatcher(rule) {
      this.config.pathMatchers.push(route(rule));
    }
  }, {
    key: 'testRoute',
    value: function testRoute(path) {
      var matching = this.config.pathMatchers.find(function (rule) {
        return rule(path);
      });
      return matching && matching(path);
    }
  }, {
    key: 'testCommand',
    value: function testCommand(phrase) {
      var sample = trim(phrase).replace(/\s/g, '/');
      var matching = this.config.pathMatchers.find(function (rule) {
        return rule(sample);
      });
      return matching && matching(sample);
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
    key: 'pathMatchers',
    value: function pathMatchers() {}
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
        testCommand: this.testCommand.bind(this),
        testRoute: this.testRoute.bind(this),
        execute: this.executor,
        validate: this.validator,
        parameters: this.parameters,
        runner: function runner() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var report = {
            errors: [],
            suggestions: [],
            warnings: []
          };

          var context = args[args.length - 1];

          var localHelpers = {
            abort: function abort(message) {
              var _report$errors;

              console.error(message);

              for (var _len3 = arguments.length, r = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                r[_key3 - 1] = arguments[_key3];
              }

              (_report$errors = report.errors).push.apply(_report$errors, [message].concat((0, _toConsumableArray3.default)(r)));
              process.exit(1);
            },
            error: function error(message) {
              var _console;

              for (var _len4 = arguments.length, r = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                r[_key4 - 1] = arguments[_key4];
              }

              (_console = console).log.apply(_console, [message.red].concat((0, _toConsumableArray3.default)(r)));
              report.errors.push(message);
            },
            warn: function warn(message) {
              var _console2;

              for (var _len5 = arguments.length, r = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                r[_key5 - 1] = arguments[_key5];
              }

              (_console2 = console).log.apply(_console2, [message.yellow].concat((0, _toConsumableArray3.default)(r)));
              report.warnings.push(message);
            },
            suggest: function suggest(message) {
              var _console3;

              for (var _len6 = arguments.length, r = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                r[_key6 - 1] = arguments[_key6];
              }

              (_console3 = console).log.apply(_console3, [message.white].concat((0, _toConsumableArray3.default)(r)));
              report.suggestions.push(message);
            },

            report: report,
            context: context
          };

          context.report = report;

          var passesValidation = (0, _util.noConflict)(function () {
            var _def$api;

            return (_def$api = def.api).validate.apply(_def$api, args);
          }, localHelpers).apply(undefined, args);

          if (passesValidation === false) {
            report.success = false;
            return report;
          }

          report.result = (0, _util.noConflict)(function () {
            try {
              var _def$api2;

              var _r = (_def$api2 = def.api).execute.apply(_def$api2, args);
              if (_r) {
                report.success = true;
              }
              return _r;
            } catch (err) {
              report.errors.push('fatal error:' + err.message);
            }
          }, localHelpers).apply(undefined, args);

          return report;
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
  commandPhrase: function commandPhrase() {
    var _tracker$_curr9;

    (_tracker$_curr9 = tracker[_curr]).addCommandPhrase.apply(_tracker$_curr9, arguments);
  },
  route: function route() {
    var _tracker$_curr10;

    (_tracker$_curr10 = tracker[_curr]).addRouteMatcher.apply(_tracker$_curr10, arguments);
  },
  expose: function expose() {
    var _tracker$_curr11;

    (_tracker$_curr11 = tracker[_curr]).expose.apply(_tracker$_curr11, arguments);
  },
  cli: function cli() {
    var _tracker$_curr12;

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    (_tracker$_curr12 = tracker[_curr]).expose.apply(_tracker$_curr12, ['cli'].concat(args));
  },
  ipc: function ipc() {
    var _tracker$_curr13;

    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    (_tracker$_curr13 = tracker[_curr]).expose.apply(_tracker$_curr13, ['ipc'].concat(args));
  },
  web: function web() {
    var _tracker$_curr14;

    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    (_tracker$_curr14 = tracker[_curr]).expose.apply(_tracker$_curr14, ['web'].concat(args));
  }
});