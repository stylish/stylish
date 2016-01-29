/**
 * Main Application Entry Point
 *
 * This will be used by the skypager-devpack webpack setup to serve the webapp.
 *
*/

import { WebApplication as Application, authentication } from 'skypager-application'

import HomePage from './entries/HomePage'

Application.render({
  extensions: [ authentication({
    lock: {
      get provider() {
        return window.Auth0Lock
      },
      clientId: 'whatever',
      clientDomain: 'whatever'
    }
  }) ],
  entries: {
    default: HomePage
  }
})
