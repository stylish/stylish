'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDefinition = undefined;

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

var ViewDefinition = exports.ViewDefinition = (function () {
  function ViewDefinition(name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? { type: type } : arguments[1];
    (0, _classCallCheck3.default)(this, ViewDefinition);

    this.name = name;
    this.options = options;
    this.type = type;
  }

  (0, _createClass3.default)(ViewDefinition, [{
    key: 'toReactComponent',
    value: function toReactComponent() {}
  }]);
  return ViewDefinition;
})();

ViewDefinition.current = current;
ViewDefinition.clearDefinition = clearDefinition;

function DSL(fn) {
  return (0, _util.noConflict)(fn, DSL)();
}

function lookup(viewName) {
  return tracker[_curr = tabelize((0, _util.parameterize)(viewName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  layout: function layout(viewName) {
    tracker[_curr = tabelize((0, _util.parameterize)(viewName)).toLowerCase()] = new ViewDefinition(viewName, fn);
  },
  page: function page(viewName) {
    tracker[_curr = viewName] = new ViewDefinition(viewName, { type: 'page' });
  },
  view: function view(viewName) {
    tracker[_curr = viewName] = new ViewDefinition(viewName, { type: 'component' });
  },
  component: function component(viewName) {
    tracker[_curr = viewName] = new ViewDefinition(viewName, { type: 'component' });
  }
});