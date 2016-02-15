import { defaults } from 'lodash'
import Deepstream from 'deepstream.io'
import RedisCacheConnector from 'deepstream.io-cache-redis'
import RedisMessageConnector from 'deepstream.io-msg-redis'

import * as permissions from './permissions'

export const constants = Deepstream.constants

export class Server extends Deepstream {
  static constants = constants;

  constructor(options = {}, context = {}) {
    let { project } = context
    let env = options.env || process.env.NODE_ENV || 'development'

    defaults(options, {
      port: 6020,
      host: 'localhost',
      cachePort: 6379,
      cacheHost: 'localhost',
      start: false,
      env: process.env.NODE_ENV || 'development',
      permissions,
      paths: {
        serverLog: project.path('logs', `deepstream.server.${ env }.log`),
        errorLog: project.path('logs', `deepstream.error.${ env }.log`)
      }
    })

    super(`${ options.host }:${ options.port }`)

    let { cachePort, cacheHost } = options
    let { isValidUser, canPerformAction } = options.permissions

    this.set('showLogo', false)

    this.set('logger', require('./logger')(options))

    this.set('cache', new RedisCacheConnector({
      port: cachePort,
      host: cacheHost
    }))

    this.set('messageConnector', new RedisMessageConnector({
      port: cachePort,
      host: cacheHost
    }))

    this.set('permissionHandler', {
      isValidUser: function (connectionData, authData, callback) {
        if (isValidUser(connectionData, authData, project)) {
           return callback(null, authData.username || 'anonymous')
        }
      },

      canPerformAction: function(username, message, callback) {
        if (canPerformAction(username, message, project)) {
          return callback(null, true)
        }
      }
    })

    if (options.start) {
      this.start()
    }
  }
}

export default Server
