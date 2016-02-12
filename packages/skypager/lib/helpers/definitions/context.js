'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextDefiniton = undefined;

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
  return tracker[_curr];
}
function clearDefinition() {
  _curr = null;delete tracker[_curr];
}

var ContextDefiniton = exports.ContextDefiniton = (function () {
  function ContextDefiniton(contextName) {
    (0, _classCallCheck3.default)(this, ContextDefiniton);

    this.name = contextName;
    this.config = {};
    this.version = '0.0.1';
    this.generator = function () {
      return {};
    };
  }

  (0, _createClass3.default)(ContextDefiniton, [{
    key: 'create',
    value: function create() {
      return {
        data: this.generator
      };
    }
  }, {
    key: 'api',
    get: function get() {
      return {
        name: this.name,
        generator: this.generator,
        create: function create() {
          return this.create.apply(this, arguments);
        }
      };
    }
  }]);
  return ContextDefiniton;
})();

ContextDefinition.current = current;
ContextDefinition.clearDefinition = clearDefinition;

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

function lookup(contextName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(contextName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  context: function context(contextName) {
    tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(contextName))] = new ContextDefinition(contextName);
  },
  generate: function generate() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).generate.apply(_tracker$_curr, arguments);
  }
});