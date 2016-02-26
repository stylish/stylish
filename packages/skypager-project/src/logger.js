import { Logger, transports } from 'winston'

export function logger(project, options = {}) {

  if (project.logger) {
    return project.logger
  }

  let env = project.env

  let _transports = [
    new transports.File({
      name: `project`,
      filename: project.path('logs', `project.log`)
    })
  ]

  if (options.debug || process.env.SKYPAGER_DEBUG_STDOUT ==='stdout') {
    _transports.unshift( new transports.Console({ colorize: true }))
  }

  defineProperty(project, 'logger', {
    enumerable: false,
    configurable: false,
    value: new Logger({
      level: 'debug',
      transports: _transports
    })
  })

  assign(project, {
    log(...args) {
      project.logger.log('info', ...args)
    },

    error(...args) {
      project.logger.log('error', ...args)
    },

    debug(...args) {
      project.logger.log('debug', ...args)
    }
  })

  return project.logger
}

export default logger

const { assign, defineProperty } = Object
