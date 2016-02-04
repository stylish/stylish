import { Application } from './application'

import { loadProjectFromDirectory as loadProject } from 'skypager/lib/util'

import pick from 'lodash/object/pick'

global.pick = pick
global.assign = Object.assign
global.keys = Object.keys

export function enter (options = {}) {
  let { project, argv } = options

  let app = new Application(project, pick(options, 'argv', 'command'))

  if (!argv.dontBoot) { app.boot() }

  return app
}
