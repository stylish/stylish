'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layouts = undefined;

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

var _jsxFileName = 'src/entries/Layouts/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _DashboardHeader = require('ui/components/DashboardHeader');

var _DashboardHeader2 = _interopRequireDefault(_DashboardHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layouts = exports.Layouts = (function (_Component) {
  (0, _inherits3.default)(Layouts, _Component);

  function Layouts() {
    (0, _classCallCheck3.default)(this, Layouts);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Layouts).apply(this, arguments));
  }

  (0, _createClass3.default)(Layouts, [{
    key: 'render',
    value: function render() {
      var copy = this.props.copy;

      return _react2.default.createElement(
        'div',
        { className: 'p-t-md', __source: {
            fileName: _jsxFileName,
            lineNumber: 30
          }
        },
        _react2.default.createElement(_DashboardHeader2.default, { title: copy.layouts.browseHeading, subtitle: copy.layouts.browseSubtitle, __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          }
        }),
        _react2.default.createElement('hr', { className: 'm-t-md', __source: {
            fileName: _jsxFileName,
            lineNumber: 32
          }
        }),
        this.props.children
      );
    }
  }]);
  return Layouts;
})(_react.Component);

Layouts.displayName = 'Layouts';
Layouts.route = {
  screens: {
    index: 'Layouts/Browse',
    'details/*': 'Layouts/Details'
  }
};
Layouts.propTypes = {
  /** copy pulled from the projects i18n system */
  copy: _react.PropTypes.shape({
    layouts: _react.PropTypes.shape({
      browseHeading: _react.PropTypes.string,
      browseSubtitle: _react.PropTypes.string
    })
  })
};
exports.default = (0, _stateful2.default)(Layouts, 'settings', 'layouts.filters', 'copy');