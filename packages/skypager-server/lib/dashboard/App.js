'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _jsxFileName = 'src/dashboard/App.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _util = require('../util.js');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = exports.App = (function (_Component) {
  (0, _inherits3.default)(App, _Component);

  function App() {
    var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, App);
    var options = args.options;
    var project = args.project;
    var screen = args.screen;

    var props = (0, _lodash.omit)(args, 'screen', 'project');

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(App).call(this, props));

    (0, _util.define)(_this, 'project', project);
    (0, _util.define)(_this, 'screen', screen);
    (0, _util.define)(_this, 'log', screen.log.bind(screen));

    var panels = (0, _keys2.default)(options.panels).map(function (ref, key) {
      var panel = options.panels[ref];

      return (0, _extends3.default)({
        type: panel.type || 'log',
        ref: ref
      }, panel, borderStyles(panel.borderStyles), {
        key: key
      });
    });

    _this.state = {
      panels: panels
    };
    return _this;
  }

  (0, _createClass3.default)(App, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        project: this.project,
        screen: this.screen,
        settings: this.project.settings,
        log: this.log
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var panels = this.state.panels;
      var streamer = this.props.streamer;

      var app = this;

      panels.filter(function (panel) {
        return panel.process && panel.type === 'log';
      }).forEach(function (panel) {
        var logPath = _this2.project.path('logs', 'streamer-' + panel.process + '.log');
        (0, _util.shell)('tail -f ' + logPath, {}, function (buffer) {
          app.refs[panel.ref].add(buffer.toString());
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var panels = this.state.panels;
      var project = this.project;

      var boxes = panels.map(function (panel, key) {
        return (0, _react.createElement)(panel.type, panel);
      });

      return _react2.default.createElement(
        'box',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 78
          }
        },
        boxes
      );
    }
  }]);
  return App;
})(_react.Component);

App.childContextTypes = {
  project: _react.PropTypes.object,
  screen: _react.PropTypes.object,
  settings: _react.PropTypes.object,
  log: _react.PropTypes.func
};
exports.default = App;

function borderStyles() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? { style: 'line', color: 'white' } : arguments[0];
  var style = options.style;
  var color = options.color;

  return {
    border: {
      type: style
    },
    style: {
      border: {
        fg: color
      }
    }
  };
}