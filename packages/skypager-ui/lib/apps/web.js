'use strict';

var _WebApp = require('ui/shells/WebApp');

var _WebApp2 = _interopRequireDefault(_WebApp);

var _loader = require('ui/bundle/loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bundle = (0, _loader2.default)(require('dist/bundle'));

_WebApp2.default.create({
  bundle: bundle
});