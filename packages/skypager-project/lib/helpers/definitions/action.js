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
      var action = this;

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

              for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
              }

              (_report$errors = report.errors).push.apply(_report$errors, [message].concat((0, _toConsumableArray3.default)(args)));
              process.exit(1);
            },
            error: function error(message) {
              var _action$_helper, _console;

              for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
              }

              (_action$_helper = action._helper).emit.apply(_action$_helper, ['error', message].concat((0, _toConsumableArray3.default)(args)));
              (_console = console).log.apply(_console, [message].concat((0, _toConsumableArray3.default)(args)));
              report.errors.push(message);
            },
            warn: function warn(message) {
              var _action$_helper2, _console2;

              for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
              }

              (_action$_helper2 = action._helper).emit.apply(_action$_helper2, ['warn', message].concat((0, _toConsumableArray3.default)(args)));
              (_console2 = console).log.apply(_console2, [message].concat((0, _toConsumableArray3.default)(args)));
              report.warnings.push(message);
            },

            //deprecated
            suggest: function suggest(message) {
              var _action$_helper3, _console3;

              for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                args[_key6 - 1] = arguments[_key6];
              }

              (_action$_helper3 = action._helper).emit.apply(_action$_helper3, ['suggest', message].concat((0, _toConsumableArray3.default)(args)));
              (_console3 = console).log.apply(_console3, [message].concat((0, _toConsumableArray3.default)(args)));
              report.suggestions.push(message);
            },
            info: function info(message) {
              var _action$_helper4, _console4;

              for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                args[_key7 - 1] = arguments[_key7];
              }

              (_action$_helper4 = action._helper).emit.apply(_action$_helper4, ['info', message].concat((0, _toConsumableArray3.default)(args)));
              (_console4 = console).log.apply(_console4, [message].concat((0, _toConsumableArray3.default)(args)));
              report.suggestions.push(message);
            },
            done: function done(result) {
              var _action$_helper5;

              for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
                args[_key8 - 1] = arguments[_key8];
              }

              (_action$_helper5 = action._helper).emit.apply(_action$_helper5, ['done', result].concat((0, _toConsumableArray3.default)(args)));
            },

            report: report,
            context: context
          };

          context.report = report;

          var passesValidation = (0, _util.noConflict)(function () {
            var _action$api;

            return (_action$api = action.api).validate.apply(_action$api, (0, _toConsumableArray3.default)(args));
          }, localHelpers).apply(undefined, (0, _toConsumableArray3.default)(args));

          if (passesValidation === false) {
            report.success = false;
            return report;
          }

          report.result = (0, _util.noConflict)(function () {
            try {
              var _action$api2;

              var r = (_action$api2 = action.api).execute.apply(_action$api2, (0, _toConsumableArray3.default)(args));
              if (r) {
                report.success = true;
                report.result = r;
              }
              return r;
            } catch (err) {
              report.errors.push('fatal error:' + err.message);
            }
          }, localHelpers).apply(undefined, (0, _toConsumableArray3.default)(args));

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

    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    (_tracker$_curr12 = tracker[_curr]).expose.apply(_tracker$_curr12, ['cli'].concat(args));
  },
  ipc: function ipc() {
    var _tracker$_curr13;

    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    (_tracker$_curr13 = tracker[_curr]).expose.apply(_tracker$_curr13, ['ipc'].concat(args));
  },
  web: function web() {
    var _tracker$_curr14;

    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    (_tracker$_curr14 = tracker[_curr]).expose.apply(_tracker$_curr14, ['web'].concat(args));
  }
});