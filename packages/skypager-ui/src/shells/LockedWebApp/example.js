/**
 * Locked WebApp Example
 *
 * The LockedWebApp class wraps the standard WebApp shell with the Auth0 Service using
 * its Lock library.  We simply won't render the WebApp at all without first obtaining
 * an authorization token from Auth0.
 *
 */
import LockedWebApp from 'ui/shells/LockedWebApp'
import BundleLoader from 'ui/bundle/loader'

const bundle = BundleLoader(
  require('ui/bundle/example')
)

const { clientId, domain } = bundle.settings.integrations.auth0

LockedWebApp.create({
  bundle,
  lock: { clientId, domain }
})
