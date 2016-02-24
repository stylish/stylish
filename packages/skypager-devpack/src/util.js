import { isString, isEmpty, isFunction, pick, omit, defaultsDeep as defaults } from 'lodash'

export function defineProp(object, property, value, enumerable = false, configurable = false) {
  Object.defineProperty(object, property, {
    value,
    enumerable,
    configurable
  })
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
