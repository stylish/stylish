import { Application } from './application'

import { loadProjectFromDirectory as loadProject } from 'skypager/lib/util'

import { argv } from 'yargs'

export function enter (options = {}) {
  let projectPath = options.project || process.env.PWD
  let project = loadProject(projectPath)

  let app = new Application(project)

  if (!argv.dontBoot) {
    app.boot()
  }
}
