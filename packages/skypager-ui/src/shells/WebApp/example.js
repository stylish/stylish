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
import WebApp from 'ui/shells/WebApp'
import BundleLoader from 'ui/bundle/loader'

const bundle = BundleLoader(
  require('ui/bundle/example')
)

WebApp.create({ bundle })
