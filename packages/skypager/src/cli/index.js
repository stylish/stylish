import { join, resolve } from 'path'
import { existsSync as exists } from 'fs'

import available from './available'
import build from './build'
import dashboard from './dashboard'
import create from './create'
import develop from './develop'
import exporter from './exporter'
import init from './init'
import importer from './importer'
import listen from './listen'
import publish from './publish'
import run from './run'
import repl from './repl'

import { loadProjectFromDirectory } from '../util'

export const commands = {
  available,
  build,
  dashboard,
  console: repl,
  create,
  develop,
  export: exporter,
  import: importer,
  listen,
  publish,
  run
}

export function configure (program, localConfig) {
  let handler = dispatcher.bind(program)

  available(program, handler)
  build(program, handler)
  repl(program, handler)
  create(program, handler)
  develop(program, handler)
  exporter(program, handler)
  init(program, handler)
  importer(program, handler)
  listen(program, handler)
  publish(program, handler)
  run(program, handler)
}

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
