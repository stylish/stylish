'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowseLayouts = undefined;

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

var _jsxFileName = 'src/entries/Layouts/Browse.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _FeatureList = require('ui/components/FeatureList');

var _FeatureList2 = _interopRequireDefault(_FeatureList);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var categoryFolder = 'layouts';

var BrowseLayouts = exports.BrowseLayouts = (function (_Component) {
  (0, _inherits3.default)(BrowseLayouts, _Component);

  function BrowseLayouts() {
    (0, _classCallCheck3.default)(this, BrowseLayouts);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BrowseLayouts).apply(this, arguments));
  }

  (0, _createClass3.default)(BrowseLayouts, [{
    key: 'render',
    value: function render() {
      var copy = this.props.copy;

      return _react2.default.createElement(_FeatureList2.default, { tileBody: additionalInfo, features: this.layouts, __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        }
      });
    }
  }, {
    key: 'layouts',
    get: function get() {
      var project = this.context.project;
      var _props = this.props;
      var filters = _props.filters;
      var copy = _props.copy;

      return project.scripts.query((0, _extends3.default)({}, filters, { categoryFolder: categoryFolder })).map(function (script) {
        var doc = project.docs['' + script.id] || { data: {
            icon: 'browser',
            title: script.id.split('/').pop(),
            text: ''
          } };

        return {
          icon: doc.data.icon,
          title: doc.title,
          text: doc.mainCopy,
          link: '/layouts/details/' + doc.id
        };
      });
    }
  }]);
  return BrowseLayouts;
})(_react.Component);

BrowseLayouts.displayName = 'BrowseLayouts';
BrowseLayouts.propTypes = {
  filters: _react.PropTypes.shape({
    categoryFolder: _react.PropTypes.string
  })
};
BrowseLayouts.defaultProps = {
  filters: {}
};
exports.default = (0, _stateful2.default)(BrowseLayouts, 'settings', 'layouts.filters', 'copy');

function additionalInfo() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return _react2.default.createElement(
    _reactRouter.Link,
    { to: props.link, className: 'btn btn-primary', __source: {
        fileName: _jsxFileName,
        lineNumber: 58
      }
    },
    'Details'
  );
}