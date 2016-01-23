export build from './build'
export develop from './develop'
export init from './init'
export listen from './listen'
export publish from './publish'
export run from './run'
export repl from './repl'

import { loadProjectFromDirectory } from '../util'

export function dispatcher(handlerFn) {
  let program = this

  return (...args) => {
    var project
    var options

    options = args[args.length - 1] || {}

    try {
      project = loadProjectFromDirectory(options.project || (options.parent && options.parent.project) || process.env.PWD)
    } catch (error) {
      console.log('Error loading the skypager project'.red)
      console.log(error.message)
    }

    // create a context argument that is available
    // in addition to the options arg. this will have things available
    // that are shared across every cli handler, e.g. the project object
    args.push({
      project,
      program
    })

    handlerFn(...args)
  }
}
