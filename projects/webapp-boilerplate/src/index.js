/**
 * Main Application Entry Point
 *
 * This will be used by the skypager-devpack webpack setup to serve the webapp.
 *
*/

import { WebApplication as Application } from 'skypager-application'

import { HomePage, LoginPage } from './entries'

console.log('Hi')

Application.render({
  defaultEntry: HomePage,
  entries: {
    "/login": LoginPage
  }
})
