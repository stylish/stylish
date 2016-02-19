'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconNav = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _jsxFileName = 'src/ui/components/IconNav.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _IconNavCss = require('./IconNav.css.less');

var _IconNavCss2 = _interopRequireDefault(_IconNavCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IconNav = exports.IconNav = (function (_React$Component) {
  (0, _inherits3.default)(IconNav, _React$Component);

  function IconNav() {
    (0, _classCallCheck3.default)(this, IconNav);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(IconNav).apply(this, arguments));
  }

  (0, _createClass3.default)(IconNav, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var brandStyle = _props.brandStyle;
      var brandIcon = _props.brandIcon;

      var links = (this.props.links || []).map(function (link, index) {
        var active = false;

        return _react2.default.createElement(
          'li',
          { key: index, className: active ? 'active' : undefined, __source: {
              fileName: _jsxFileName,
              lineNumber: 30
            }
          },
          _react2.default.createElement(
            _reactRouter.Link,
            { to: link.link, title: link.label, __source: {
                fileName: _jsxFileName,
                lineNumber: 31
              }
            },
            _react2.default.createElement(_Icon2.default, { icon: link.icon, __source: {
                fileName: _jsxFileName,
                lineNumber: 32
              }
            }),
            _react2.default.createElement(
              'span',
              { className: 'nav-label', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 33
                }
              },
              link.label
            )
          )
        );
      });

      var classes = (0, _classnames3.default)((0, _defineProperty3.default)({ iconav: true }, _IconNavCss2.default.iconav, true));

      return _react2.default.createElement(
        'nav',
        { className: classes, __source: {
            fileName: _jsxFileName,
            lineNumber: 42
          }
        },
        _react2.default.createElement(
          _reactRouter.Link,
          { to: '/', className: 'iconav-brand', __source: {
              fileName: _jsxFileName,
              lineNumber: 43
            }
          },
          _react2.default.createElement(_Icon2.default, { className: 'iconav-brand-icon ' + brandStyle,
            icon: brandIcon, __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            }
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'iconav-slider', __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            }
          },
          _react2.default.createElement(
            'ul',
            { className: 'nav nav-pills iconav-nav', __source: {
                fileName: _jsxFileName,
                lineNumber: 49
              }
            },
            links
          )
        )
      );
    }
  }]);
  return IconNav;
})(_react2.default.Component);

IconNav.displayName = 'IconNav';
IconNav.propTypes = {
  brandIcon: _react.PropTypes.string,
  brandStyle: _react.PropTypes.string,
  links: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    link: _react.PropTypes.string.isRequired,
    icon: _react.PropTypes.string,
    label: _react.PropTypes.string
  })).isRequired
};

function flatten(array) {
  return array.reduce(function (memo, item) {
    return memo.concat(item);
  });
}

exports.default = IconNav;