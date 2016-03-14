'use strict';

var _LockedWebApp = require('ui/shells/LockedWebApp');

var _LockedWebApp2 = _interopRequireDefault(_LockedWebApp);

var _loader = require('ui/bundle/loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Locked WebApp Example
 *
 * The LockedWebApp class wraps the standard WebApp shell with the Auth0 Service using
 * its Lock library.  We simply won't render the WebApp at all without first obtaining
 * an authorization token from Auth0.
 *
 */

var bundle = (0, _loader2.default)(require('ui/bundle/example'));

var _bundle$settings$inte = bundle.settings.integrations.auth0;
var clientId = _bundle$settings$inte.clientId;
var domain = _bundle$settings$inte.domain;

_LockedWebApp2.default.create({
  bundle: bundle,
  lock: { clientId: clientId, domain: domain }
});