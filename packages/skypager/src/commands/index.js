import colors from 'colors'

import { join, resolve } from 'path'
import { argv } from 'yargs'

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

export function commander (options = {}) {
  const program = require('commander')

  program
    .version(pkg.version)
    .option('--project <path>', 'specify which folder contains the project you wish to work with')
    .option('--debug', 'enable debugging')
    .option('--env <env>', 'which environment should we run in? defaults to NODE_ENV', process.env.NODE_ENV || 'development')

  configure(program)

  if (program.commands.map(c => c._name).indexOf(requestedCommand) < 0) {
     program.outputHelp()
  }

  return () => program.parse(process.argv)
}

export default commander

function configure (program, options = {}) {
  let project = loadProject(argv.project)
  let config = project && project.manifest && project.manifest.skypager

  let context = {
    program,
    project,
    config,
    isCLI: true
  }

  const dispatch = (handlerFn) => {
    return (...args) => {
      args.push(context)
      handlerFn(...args)
    }
  }

  author(program, dispatch)
  available(program, dispatch)
  build(program, dispatch)
  repl(program, dispatch)
  create(program, dispatch)
  develop(program, dispatch)
  exporter(program, dispatch)
  init(program, dispatch)
  importer(program, dispatch)
  listen(program, dispatch)
  publish(program, dispatch)

  // the project can dynamically add its own cli commands from certain actions
  if (project) {
    project.actions
    .filter(action => dotpath.get(action, 'definition.interfaces.cli'))
    .forEach(action => dotpath.get(action, 'definition.interfaces.cli').call(action, program, dispatch))
  }

  return () => program.parse(argv)
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


