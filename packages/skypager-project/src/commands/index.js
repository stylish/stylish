import colors from 'colors'

import { join, resolve } from 'path'
import { argv } from 'yargs'

const isDevMode = argv.devMode || process.env.SKYPAGER_ENV === 'development'

import {
  existsSync as exists,
  readFileSync as readFile,
  createWriteStream as writeStream,
  createReadStream as readStream
} from 'fs'

import author from './author'
import available from './available'
import build from './build'
import create from './create'
import develop from './develop'
import exporter from './exporter'
import init from './init'
import importer from './importer'
import listen from './listen'
import publish from './publish'
import repl from './repl'
import serve from './serve'

import { loadProjectFromDirectory, skypagerBabel, dotpath } from '../util'

import pkg from '../../package.json'

const currentDirectory = process.env.PWD

export const commands = {
  author,
  available,
  build,
  console: repl,
  create,
  develop,
  export: exporter,
  import: importer,
  listen,
  publish
}

let requestedCommand = argv._[0]

export function program (options = {}) {
  const commander = require('commander')

  commander
    .version(pkg.version)
    .option('--debug', 'enable debugging')
    .option('--dev-mode', 'run skypager in dev mode. for local development')
    .option('--env <env>', 'the application environment', process.env.NODE_ENV || 'development')
    .option('--project <path>', 'the folder contains the project you wish to work with')

  configure(commander)

  if (!requestedCommand || commander.commands.map(c => c._name).indexOf(requestedCommand) < 0) {
    // dont duplicate the output
    if (!argv.help) {
     commander.outputHelp()
    }
  }

  return () => commander.parse(process.argv)
}

export default program

function configure (commander, options = {}) {
  let project = loadProject(argv.project)
  let config = project && project.manifest && project.manifest.skypager

  let context = {
    commander,
    project,
    config,
    isCLI: true
  }

  const dispatch = (handlerFn) => {
    return (...args) => {
      args.push(context)
      try {
        handlerFn(...args)
      } catch(error) {
        console.log('Command Error:'.red)
        console.log(error.message)
        throw(error)
      }
    }
  }

  if (isDevMode) {
    author(commander, dispatch)
    available(commander, dispatch)
  }

  build(commander, dispatch)

  if (isDevMode) {
    repl(commander, dispatch)
    create(commander, dispatch)
  }


  develop(commander, dispatch)

  exporter(commander, dispatch)

  init(commander, dispatch)

  importer(commander, dispatch)

  if (isDevMode) {
    listen(commander, dispatch)
  }

  publish(commander, dispatch)

  serve(commander, dispatch)

  // the project can dynamically add its own cli commands from certain actions
  if (project && project.actions) {
    project.actions
    .filter(action => dotpath.get(action, 'definition.interfaces.cli'))
    .forEach(action => dotpath.get(action, 'definition.interfaces.cli').call(action, commander, dispatch))
  }

  return () => commander.parse(argv)
}

function loadProject(fromPath, silent = false) {
  try {
    skypagerBabel()
    return loadProjectFromDirectory(fromPath || process.env.PWD)
  } catch (error) {
    if (!silent && requestedCommand !== 'init' && requestedCommand !== 'help') {
      console.error(
        `Error loading skypager project. Run this from within a project directory.`.red
      )

      console.log(error.message)
      console.log(error.stack)
    }
  }
}

