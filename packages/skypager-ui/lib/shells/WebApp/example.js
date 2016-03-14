'use strict';

var _WebApp = require('ui/shells/WebApp');

var _WebApp2 = _interopRequireDefault(_WebApp);

var _loader = require('ui/bundle/loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * WebApp Example
 *
 * The WebApp shell will generate a `React.Router` application consisting
 * of multiple screens or `Entry Point` React.Component classes. Redux is used
 * to manage all of the application state.
 *
 * All of this stuff is handled for you if you follow conventions for storing
 * React Components, Redux Reducer definitions, etc.
 *
 */

var bundle = (0, _loader2.default)(require('ui/bundle/example'));

_WebApp2.default.create({ bundle: bundle });