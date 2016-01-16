import colors from 'colors'

import os from 'os'
import url from 'url'
import address from 'url-parse-as-address'
import isDomain from 'is-domain'

import { argv } from 'yargs'
import { existsSync as exists, readFileSync } from 'fs'
import { extname, join, dirname, basename, resolve } from 'path'
import { start as startRepl } from 'repl'

import * as middleware from './middleware'

let skypager

if (process.env.NODE_ENV === 'development') {
  throw('tantri')
  skypager = require('../src/index')
} else {
  skypager = require('../lib/index')
}

const brand = 'Skypager'
const args = argv._
const command = args[0] || 'help'
const details = args.slice(1, args.length)
const lastWord = details[ details.length - 1 ]
const phrase  = args.join(' ')
const options = argv
const middle = details.slice(0, details.length - 1)

const context = {
  argv,
  skypager,
  debug,
  pwd,
  join,
  command,
  args,
  details,
  phrase,
  options,
  exists,
  readFile,
  lastWord,
  middle
}

let commands = {
  browse,
  run,
  help,
  export: runExporter,
  console: runConsole,
  author,
  serve,
  publish,
  devmode,
  login,
  logout,
  whoami,
  test
}

function stub(req, next) { next() }

function readFile (filePath, parseJSON=true) {
  let ext = extname(filePath)
  let raw = readFileSync(filePath).toString()

  if (ext === '.json' && parseJSON) {
    return JSON.parse(raw)
  }

  return raw
}

function pipeline (...pipe) {
  let request = {}

  pipe.forEach((item,i) => {
    let fn = typeof item === 'string' ? middleware[item] : item

    if (!request[item]) {
      fn.call(context, request, ()=> { })
    }
  })
}

function help () {}

const RUNNABLE_HELPER_TYPES = [
  'exporter',
  'action',
  'importer'
]

function runConsole () {
  pipeline('pkg','project','plugins', (request, next) => {
    repl(Object.assign({},context,request))
  })
}

function run () {
  pipeline('pkg','project','plugins', (request, next) => {
    let { project } = request
    let helper

    if (!project) {
       abort('Could not find project. Specify a path manually via --project or run from inside a project directory.')
    }

    if (details.length === 0) { abort('Invalid run command') }

    let helperId = details.length === 2 ? details[0] : middle.join('/')

    if (RUNNABLE_HELPER_TYPES.indexOf(lastWord) >= 0) {
      let registry = project[ lastWord + 's' ]
      let helper = registry.lookup(helperId, false)
      if (!helper) { abort(`could not find an action helper using ${ helperId }`) }

      if (helper) {
        log(`Running ${ details.join(' ') }`.green)
      }
    }
  })
}

function abort (msg) {
  console.log('')
  console.log('Aborting:'.red )
  console.log(msg)
  console.log('')

  process.exit(1)
}

function author () {
  var electron = require('electron-prebuilt'),
      authorRoot = join(__dirname, '../../skypager-author')

  pipeline('pkg','project','plugins', (request, next) => {
      spawn(electron, [authorRoot].concat(args),{
        output: process.output,
        input: process.input
      })
  })
}

function browse () {
  pipeline('pkg','project','plugins', (request, next) => {
    let { project } = request
    let [ model, ...rest ] = details
  })
}

function serve () {}
function publish () {}
function devmode () {}
function login () {}
function whoami () {}
function logout () {}
function create () {}
function available () {}

function runExporter () {
  pipeline('pkg','project', (req, next) => {
    let { project } = req
  })
}

function repl (additionalContext = {}) {
  let replServer = startRepl({
    prompt: 'skypager'.magenta + ':> '
  })

  Object.keys(context).forEach(key => {
    replServer.context[key] = context[key]
  })

  Object.keys(additionalContext).forEach(key => {
    replServer.context[key] = additionalContext[key]
  })
}

function warn(...i) {
  i.unshift(brand.yellow + '> ')
  i = i.filter(function(n){ return n != undefined });
  console.log.apply(console, i)
  return this
}

function debug(...i){
  i.unshift(brand.magenta + '> ')
  i = i.filter(function(n){ return n != undefined });
  console.log.apply(console, i)
  return this
};

function pwd(...p) {
  p.unshift(process.env.PWD)
  return join(...p)
}

function test () {
  pipeline('pkg', 'project', (req,next) => {

    if (context.phrase === 'test console') {
      if (!req.project && !argv.project) {
        req.project = require(pwd('./test/fixture'))
      }

      repl(req)
    }

    next()
  })
}

if (commands[command]) {
  commands[command]()
} else {
  commands.help()
}
