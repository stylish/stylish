import Application from './containers/Application'
import LockedApplication from './containers/LockedApplication'

import { stateful } from './util/stateful'

const application = {
  Application,
  LockedApplication,
  util: {
    stateful
  }
}

module.exports = application
