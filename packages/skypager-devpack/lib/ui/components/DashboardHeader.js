'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/ui/components/DashboardHeader.js';
exports.DashboardHeader = DashboardHeader;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DashboardHeader() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var title = props.title;
  var subtitle = props.subtitle;
  var children = props.children;

  return _react2.default.createElement(
    'div',
    { className: 'dashhead', __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'dashhead-titles', __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      },
      _react2.default.createElement(
        'h6',
        { className: 'dashhead-subtitle', __source: {
            fileName: _jsxFileName,
            lineNumber: 9
          }
        },
        subtitle
      ),
      _react2.default.createElement(
        'h2',
        { className: 'dashhead-title', __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        title
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'dashhead-toolbar', __source: {
          fileName: _jsxFileName,
          lineNumber: 13
        }
      },
      children
    )
  );
}

DashboardHeader.propTypes = {
  subtitle: _react.PropTypes.string,
  title: _react.PropTypes.string,
  children: _react.PropTypes.node
};

DashboardHeader.divider = function (key) {
  return _react2.default.createElement('span', { key: key, className: 'dashhead-toolbar-divider hidden-xs', __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    }
  });
};

exports.default = DashboardHeader;