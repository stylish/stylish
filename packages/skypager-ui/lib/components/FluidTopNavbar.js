'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FluidTopNavbar = undefined;

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

var _jsxFileName = 'src/components/FluidTopNavbar.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBodyClassname = require('react-body-classname');

var _reactBodyClassname2 = _interopRequireDefault(_reactBodyClassname);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRouter = require('react-router');

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FluidTopNavbar = exports.FluidTopNavbar = (function (_React$Component) {
  (0, _inherits3.default)(FluidTopNavbar, _React$Component);

  function FluidTopNavbar() {
    (0, _classCallCheck3.default)(this, FluidTopNavbar);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FluidTopNavbar).apply(this, arguments));
  }

  (0, _createClass3.default)(FluidTopNavbar, [{
    key: 'render',
    value: function render() {
      var classes = (0, _classnames2.default)({ 'fluid-layout': true, 'with-top-navbar': true });

      return _react2.default.createElement(
        _reactBodyClassname2.default,
        { className: classes, __source: {
            fileName: _jsxFileName,
            lineNumber: 13
          }
        },
        _react2.default.createElement(
          'nav',
          { className: 'navbar navbar-inverse navbar-fixed-top', __source: {
              fileName: _jsxFileName,
              lineNumber: 14
            }
          },
          _react2.default.createElement(
            'div',
            { className: 'container-fluid container-fluid-spacious', __source: {
                fileName: _jsxFileName,
                lineNumber: 15
              }
            },
            _react2.default.createElement(
              'div',
              { className: 'navbar-header', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 16
                }
              },
              _react2.default.createElement(
                'button',
                { type: 'button', className: 'navbar-toggle collapsed', 'data-toggle': 'collapse', 'data-target': '#navbar', 'aria-expanded': 'false', 'aria-controls': 'navbar', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 17
                  }
                },
                _react2.default.createElement(
                  'span',
                  { className: 'sr-only', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 18
                    }
                  },
                  'Toggle navigation'
                ),
                _react2.default.createElement('span', { className: 'icon-bar', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 19
                  }
                }),
                _react2.default.createElement('span', { className: 'icon-bar', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 20
                  }
                }),
                _react2.default.createElement('span', { className: 'icon-bar', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 21
                  }
                })
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { className: 'navbar-brand navbar-brand-emphasized', to: '/', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 23
                  }
                },
                _react2.default.createElement(_Icon2.default, { className: 'navbar-brand-icon', icon: 'leaf', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 24
                  }
                }),
                'Dashboard'
              )
            ),
            _react2.default.createElement(
              'div',
              { id: 'navbar', className: 'navbar-collapse collapse', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 28
                }
              },
              _react2.default.createElement(
                'ul',
                { className: 'nav navbar-nav', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 29
                  }
                },
                this.props.children
              ),
              _react2.default.createElement(
                'form',
                { className: 'form-inline navbar-form navbar-right', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 32
                  }
                },
                _react2.default.createElement(
                  'div',
                  { className: 'input-with-icon', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 33
                    }
                  },
                  _react2.default.createElement('input', { className: 'form-control', type: 'text', placeholder: 'Search...', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 34
                    }
                  }),
                  _react2.default.createElement('span', { className: 'icon icon-magnifying-glass', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 35
                    }
                  })
                )
              )
            )
          )
        )
      );
    }
  }]);
  return FluidTopNavbar;
})(_react2.default.Component);

FluidTopNavbar.propTypes = {
  children: _react2.default.PropTypes.array
};

exports.default = FluidTopNavbar;