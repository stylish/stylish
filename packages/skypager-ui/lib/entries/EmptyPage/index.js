'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Home = undefined;

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

var _jsxFileName = 'src/entries/EmptyPage/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBodyClassname = require('react-body-classname');

var _reactBodyClassname2 = _interopRequireDefault(_reactBodyClassname);

var _reactRouter = require('react-router');

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _Block = require('components/Block');

var _Block2 = _interopRequireDefault(_Block);

var _CodeHighlighter = require('components/CodeHighlighter');

var _CodeHighlighter2 = _interopRequireDefault(_CodeHighlighter);

var _FeatureList = require('components/FeatureList');

var _FeatureList2 = _interopRequireDefault(_FeatureList);

var _SkypagerLogo = require('components/SkypagerLogo');

var _SkypagerLogo2 = _interopRequireDefault(_SkypagerLogo);

var _style = require('entries/Home/style.less');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = exports.Home = (function (_Component) {
  (0, _inherits3.default)(Home, _Component);

  function Home() {
    (0, _classCallCheck3.default)(this, Home);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Home).apply(this, arguments));
  }

  (0, _createClass3.default)(Home, [{
    key: 'render',
    value: function render() {
      var _get = (0, _get3.default)(this.props, 'copy.home');

      var hero = _get.hero;
      var features = _get.features;

      return _react2.default.createElement(
        _reactBodyClassname2.default,
        { className: 'iconav-hidden', __source: {
            fileName: _jsxFileName,
            lineNumber: 32
          }
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 33
            }
          },
          _react2.default.createElement(_CodeHighlighter2.default, { theme: 'hybrid', code: install, language: 'bash', __source: {
              fileName: _jsxFileName,
              lineNumber: 34
            }
          }),
          _react2.default.createElement(_CodeHighlighter2.default, { theme: 'hybrid', code: code, language: 'es6', __source: {
              fileName: _jsxFileName,
              lineNumber: 35
            }
          }),
          _react2.default.createElement(_FeatureList2.default, { ref: 'features', spacer: 'm-b-md', features: features, __source: {
              fileName: _jsxFileName,
              lineNumber: 36
            }
          })
        )
      );
    }
  }]);
  return Home;
})(_react.Component);

Home.displayName = 'Home';
Home.route = {
  hideNav: true
};
Home.propTypes = {
  copy: _react.PropTypes.shape({
    home: _react.PropTypes.object.isRequired
  })
};
exports.default = (0, _stateful2.default)(Home, 'copy');

var install = '\nnpm install skypager-cli -g\nskypager init my-portfolio --portfolio\ncd my-portfolio && npm install\nskypager serve\n'.trim();

var code = '\nimport WebApp from \'skypager-ui/shells/WebApp\'\nimport bundle from \'skypager-ui/bundle/loader\'\n\n/**\n* The WebApp shell generates a React.Router application consisting\n* of whatever screens are in your project. Redux is automatically configured\n* to manage your application state.\n*/\nWebApp.create({ bundle })\n'.trim();