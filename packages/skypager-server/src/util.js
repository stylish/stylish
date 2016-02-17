import { spawn as spawnAsync } from 'child_process'
import { spawn as spawnPromise } from 'child-process-promise'
import { isString, isEmpty, isFunction, pick, omit, defaultsDeep as defaults } from 'lodash'

export function defineProp(object, property, value, enumerable = false, configurable = false) {
  Object.defineProperty(object, property, {
    value,
    enumerable,
    configurable
  })
}

export function spawn(command, options = {}, progress) {
  let [cmd, ...args] = command.split(' ')

  // this might be overkill
  if (options.cwd) {
    options.env = Object.assign({}, process.env, (options.env || {}), {
      PWD: options.cwd
    })
  }

  return progress
    ? spawnPromise(cmd, args, options).progress(progress)
    : spawnPromise(cmd, args, options)
}

export function shell(command, options = {}, handle){
  if (!handle && !isFunction(options) && isEmpty(options)){

  } else if ( !handle && isFunction(options) ) {
     handle = options
     options = {}
  }

  let [cmd, ...args] = command.split(' ')

  let debug = writeable(process.env.PWD + '/log/debug.log')

  if (options.cwd) {
    options.env = Object.assign({}, process.env, {
      PWD: options.cwd
    })
  }

  let proc = spawnAsync(cmd, args, options)

  if (handle) {
    proc.stdout && proc.stdout.on('data', (data) => handle(data.toString()))
    proc.stderr && proc.stderr.on('data', (data) => handle(data.toString()))
    proc.on('error', (data) => handle(data.toString()))
  }

  proc.on('error', (...args) => {
    debug.write(
      colorize(...args)
    )
  })

  return proc
}

export function colorize(object, options = {}) {
  let engine = require('./util/colorize')

  engine.setOptions(
    defaults(options, {
      colors:{
        num   : 'cyan',
        str   : 'magenta',
        bool  : 'red',
        regex : 'blue',
        undef : 'grey',
        null  : 'grey',
        attr  : 'green',
        quot  : 'yellow',
        punc  : 'yellow',
        brack : 'yellow',
        func  : 'grey'
      },
      display:{
        func: false,
        date: false,
        xarr: true
      },
      level: {
        show   : false,
        char   : '.',
        color  : 'red',
        spaces : 2,
        start  : 0
      },
      params: {
        async: false,
        colored: true
      }
    })
  )

  return engine.gen(object, options.level.start)
}
