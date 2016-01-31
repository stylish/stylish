import Application from './containers/Application'
import LockedApplication from './containers/LockedApplication.js'
import ProjectBundle from './ProjectBundle'

import { stateful } from './util/stateful'

const containers = {
  Application,
  LockedApplication,
  ProjectBundle,
  stateful
}

module.exports = containers
