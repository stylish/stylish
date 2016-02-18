import Application from './containers/Application'
import LockedApplication from './containers/LockedApplication'

import { stateful } from './util/stateful'

const application = {
  Application,
  LockedApplication,
  stateful,
  util: {
    stateful
  }
}

module.exports = application
