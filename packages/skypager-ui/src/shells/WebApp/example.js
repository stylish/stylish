/**
 * The WebApp shell will generate a `React.Router` application consisting
 * of multiple screens  Redux is automatically configured to manage your application state.
 */

import WebApp from 'ui/shells/WebApp'

WebApp.create({
  // your project's content and settings
  bundle: require('dist/bundle'),

  // lazy load screens by name
  screens: [
    'Home',
    'About',
    'Jobs'
  ]
})
