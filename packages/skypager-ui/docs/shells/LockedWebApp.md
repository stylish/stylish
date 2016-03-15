---
type: component
title: LockedWebApp
icon: lock
---

# Locked Web Application

The LockedWebApplication uses the Auth0 Lock API to prevent access to the application to anyone without an account.

## Examples

This shell is a standard web app in every way.  The only requirement is that we must pass a property called `lock` that contains credentials for the Authzero service.

```javascript
import LockedWebApp from 'ui/shells/LockedWebApp'
import BundleLoader from 'ui/bundle/loader'

const bundle = BundleLoader(
  require('dist/bundle')
)

const lock = bundle.get('settings.integrations.auth0')

LockedWebApp.create({
  bundle,
  lock
})
```
