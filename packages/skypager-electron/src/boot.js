import { app } from 'electron'
import { Application } from './application'
import { argv } from 'yargs'
import { loadProjectFromDirectory as loadProject } from 'skypager-project/lib/util'

import defaults from 'lodash/object/defaults'

export function enter (options = {}) {
  if (options.project && typeof options.project === 'string') {
    options.project = loadProject(options.project || process.env.PWD)
  }

  let project = options.project

  let SkypagerApp = new Application(project, options)

  if (!(argv.dontBoot || options.dontBoot)) {
    SkypagerApp.boot()
  }

  return SkypagerApp
}

export default enter
