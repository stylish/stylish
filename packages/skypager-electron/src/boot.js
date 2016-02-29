import { app } from 'electron'
import { Application } from './application'
import { argv } from 'yargs'
import { loadProjectFromDirectory as loadProject } from 'skypager-project/lib/util'

import defaults from 'lodash/defaults'

let SkypagerApp = null

export function enter(options = {}) {
  let shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    if (SkypagerApp) {
      SkypagerApp.restoreFocus()
    }
    return true;
  });

  if (shouldQuit) {
    app.quit()
  }

  return SkypagerApp = boot(options)
}

function boot (options = {}) {
  if (options.project && typeof options.project === 'string') {
    options.project = loadProject(options.project || process.env.PWD)
  }

  let project = options.project

  let myApp = new Application(project, options)

  if (!(argv.dontBoot || options.dontBoot)) {
    myApp.boot(app)
  }

  return myApp
}

export default enter
