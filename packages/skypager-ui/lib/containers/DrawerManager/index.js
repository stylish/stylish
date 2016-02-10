'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.LOAD_RIGHT_DRAWER = exports.TOGGLE_RIGHT_DRAWER = exports.DrawerManager = exports.initialState = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _jsxFileName = 'src/containers/DrawerManager/index.js';
exports.toggleRightDrawer = toggleRightDrawer;
exports.loadRightDrawer = loadRightDrawer;
exports.reducer = reducer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactBodyClassname = require('react-body-classname');

var _reactBodyClassname2 = _interopRequireDefault(_reactBodyClassname);

var _SlideDrawer = require('../../components/SlideDrawer');

var _SlideDrawer2 = _interopRequireDefault(_SlideDrawer);

var _DrawerManagerCss = require('./DrawerManager.css.less');

var _DrawerManagerCss2 = _interopRequireDefault(_DrawerManagerCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = exports.initialState = {
  overlayActive: false,
  rightDrawerActive: false,
  right: {
    component: 'div',
    props: {}
  }
};

function mapStateToProps(state) {
  return {
    drawerManager: state.drawerManager
  };
}

var DrawerManager = exports.DrawerManager = (function (_React$Component) {
  (0, _inherits3.default)(DrawerManager, _React$Component);

  function DrawerManager() {
    (0, _classCallCheck3.default)(this, DrawerManager);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DrawerManager).apply(this, arguments));
  }

  (0, _createClass3.default)(DrawerManager, [{
    key: 'closeRightDrawer',
    value: function closeRightDrawer() {
      this.props.dispatch(toggleRightDrawer(false));
    }

    // TODO
    // Since the drawer manager is a singleton / root level component
    // the active contents of a drawer need to be passed in differently.
    // not sure i am going about this correctly. Can i stick a component in the Redux state?

  }, {
    key: 'renderRightDrawer',
    value: function renderRightDrawer() {
      var closeDrawer = this.closeRightDrawer.bind(this);
      var _props$drawerManager = this.props.drawerManager;
      var rightDrawerActive = _props$drawerManager.rightDrawerActive;
      var right = _props$drawerManager.right;

      if (rightDrawerActive) {
        return _react2.default.createElement(
          _SlideDrawer2.default,
          { ref: 'right', handleCloseClick: closeDrawer, active: rightDrawerActive, position: 'right', __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            }
          },
          _react2.default.createElement(right.component, right.props)
        );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _cx;

      var _props = this.props;
      var layout = _props.layout;
      var brand = _props.brand;
      var links = _props.links;
      var children = _props.children;
      var settings = _props.settings;
      var rightDrawerActive = this.props.drawerManager.rightDrawerActive;

      var bodyClassName = rightDrawerActive ? 'overlay-active' : '';

      // todo: left, right, bottom, etc
      var drawerActive = rightDrawerActive;

      var managerClasses = (0, _classnames2.default)((_cx = {}, (0, _defineProperty3.default)(_cx, _DrawerManagerCss2.default.manager, true), (0, _defineProperty3.default)(_cx, 'drawerActive', drawerActive), _cx));

      return _react2.default.createElement(
        _reactBodyClassname2.default,
        { className: bodyClassName, __source: {
            fileName: _jsxFileName,
            lineNumber: 65
          }
        },
        _react2.default.createElement(
          'div',
          { className: managerClasses, __source: {
              fileName: _jsxFileName,
              lineNumber: 66
            }
          },
          this.props.children,
          this.renderRightDrawer(),
          drawerActive ? _react2.default.createElement('div', { className: _DrawerManagerCss2.default.overlay, __source: {
              fileName: _jsxFileName,
              lineNumber: 69
            }
          }) : undefined
        )
      );
    }
  }]);
  return DrawerManager;
})(_react2.default.Component);

DrawerManager.initialState = initialState;
DrawerManager.reducer = reducer;

DrawerManager.propTypes = {
  children: _react2.default.PropTypes.node.isRequired,
  drawerManager: _react2.default.PropTypes.object
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(DrawerManager);
var TOGGLE_RIGHT_DRAWER = exports.TOGGLE_RIGHT_DRAWER = 'TOGGLE_RIGHT_DRAWER';
var LOAD_RIGHT_DRAWER = exports.LOAD_RIGHT_DRAWER = 'LOAD_RIGHT_DRAWER';

function toggleRightDrawer(active) {

  return {
    type: TOGGLE_RIGHT_DRAWER,
    payload: {
      active: active
    }
  };
}

function loadRightDrawer(_ref) {
  var _ref$component = _ref.component;
  var component = _ref$component === undefined ? 'div' : _ref$component;
  var _ref$props = _ref.props;
  var props = _ref$props === undefined ? {} : _ref$props;

  return {
    type: LOAD_RIGHT_DRAWER,
    payload: {
      active: true,
      right: {
        component: component,
        props: props
      }
    }
  };
}

var actions = exports.actions = {
  toggleRightDrawer: toggleRightDrawer,
  loadRightDrawer: loadRightDrawer
};

function reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];

  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var type = _ref2.type;
  var payload = _ref2.payload;
  var rightDrawerActive = state.rightDrawerActive;
  var right = state.right;

  if (type === TOGGLE_RIGHT_DRAWER) {
    return (0, _assign2.default)({}, state, {
      rightDrawerActive: payload.active === true && payload.active !== false || !rightDrawerActive
    });
  }

  if (type === LOAD_RIGHT_DRAWER) {
    return (0, _assign2.default)({}, state, {
      rightDrawerActive: true,
      right: payload.right || state.right
    });
  }

  return state;
}