'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowseShells = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _jsxFileName = 'src/entries/ApplicationShells/Browse.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _FeatureList = require('ui/components/FeatureList');

var _FeatureList2 = _interopRequireDefault(_FeatureList);

var _DashboardHeader = require('ui/components/DashboardHeader');

var _DashboardHeader2 = _interopRequireDefault(_DashboardHeader);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var categoryFolder = 'shells';

var BrowseShells = exports.BrowseShells = (function (_Component) {
  (0, _inherits3.default)(BrowseShells, _Component);

  function BrowseShells() {
    (0, _classCallCheck3.default)(this, BrowseShells);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BrowseShells).apply(this, arguments));
  }

  (0, _createClass3.default)(BrowseShells, [{
    key: 'render',
    value: function render() {
      var copy = this.props.copy;

      return _react2.default.createElement(_FeatureList2.default, { tileBody: additionalInfo, features: this.shells, __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        }
      });
    }
  }, {
    key: 'shells',
    get: function get() {
      var project = this.context.project;
      var _props = this.props;
      var filters = _props.filters;
      var copy = _props.copy;

      return project.scripts.query((0, _extends3.default)({}, filters, { categoryFolder: categoryFolder })).map(function (script) {
        var doc = project.docs['' + script.id];

        return {
          icon: doc.data.icon,
          title: doc.title,
          text: doc.mainCopy,
          link: '/application-shells/details/' + doc.id
        };
      });
    }
  }]);
  return BrowseShells;
})(_react.Component);

BrowseShells.displayName = 'BrowseShells';
BrowseShells.propTypes = {
  filters: _react.PropTypes.shape({
    categoryFolder: _react.PropTypes.string
  })
};
BrowseShells.defaultProps = {
  filters: {}
};
exports.default = (0, _stateful2.default)(BrowseShells, 'settings', 'shells.filters', 'copy');

function additionalInfo() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return _react2.default.createElement(
    _reactRouter.Link,
    { to: props.link, className: 'btn btn-primary', __source: {
        fileName: _jsxFileName,
        lineNumber: 54
      }
    },
    'Details'
  );
}