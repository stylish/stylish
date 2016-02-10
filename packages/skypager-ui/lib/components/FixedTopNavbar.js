'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/FixedTopNavbar.js';
exports.FixedTopNavbar = FixedTopNavbar;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FixedTopNavbar(_ref) {
  var brand = _ref.brand;
  var brandLink = _ref.brandLink;
  var links = _ref.links;

  return _react2.default.createElement(
    'nav',
    { className: 'navbar navbar-inverse navbar-fixed-top', role: 'navigation', __source: {
        fileName: _jsxFileName,
        lineNumber: 6
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'container', __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        }
      },
      _react2.default.createElement(
        'div',
        { className: 'navbar-header', __source: {
            fileName: _jsxFileName,
            lineNumber: 8
          }
        },
        _react2.default.createElement(
          'button',
          { type: 'button', className: 'navbar-toggle', 'data-toggle': 'collapse', 'data-target': '#bs-example-navbar-collapse-1', __source: {
              fileName: _jsxFileName,
              lineNumber: 9
            }
          },
          _react2.default.createElement(
            'span',
            { className: 'sr-only', __source: {
                fileName: _jsxFileName,
                lineNumber: 10
              }
            },
            'Toggle navigation'
          ),
          _react2.default.createElement('span', { className: 'icon-bar', __source: {
              fileName: _jsxFileName,
              lineNumber: 11
            }
          }),
          _react2.default.createElement('span', { className: 'icon-bar', __source: {
              fileName: _jsxFileName,
              lineNumber: 12
            }
          }),
          _react2.default.createElement('span', { className: 'icon-bar', __source: {
              fileName: _jsxFileName,
              lineNumber: 13
            }
          })
        ),
        _react2.default.createElement(
          'a',
          { className: 'navbar-brand', href: brandLink, __source: {
              fileName: _jsxFileName,
              lineNumber: 15
            }
          },
          brand
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'collapse navbar-collapse', id: 'bs-example-navbar-collapse-1', __source: {
            fileName: _jsxFileName,
            lineNumber: 17
          }
        },
        _react2.default.createElement(
          'ul',
          { className: 'nav navbar-nav', __source: {
              fileName: _jsxFileName,
              lineNumber: 18
            }
          },
          links.forEach(function (pair) {
            return _react2.default.createElement(
              'li',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 20
                }
              },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: pair[0], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 21
                  }
                },
                pair[1]
              )
            );
          })
        )
      )
    )
  );
}

FixedTopNavbar.propTypes = {
  brand: _react2.default.PropTypes.string
};

exports.default = FixedTopNavbar;