'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SET_THEMES_FILTER = 'SET_THEMES_FILTER';

var reducers = {
  themes: ThemesReducer
};

var actions = (0, _defineProperty3.default)({}, SET_THEMES_FILTER, function (payload) {
  return { type: SET_THEMES_FILTER, payload: payload };
});

var initialState = {
  filters: {}
};

function ThemesReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var _ref = arguments[1];
  var type = _ref.type;
  var payload = _ref.payload;

  switch (type) {
    case SET_THEMES_FILTER:
      return assign(state, {
        filter: payload.filter
      });

    default:
      return state;
  }
}

exports.default = {
  reducers: reducers,
  actions: actions,
  initialState: initialState,
  get constants() {
    return (0, _keys2.default)(actions);
  }
};