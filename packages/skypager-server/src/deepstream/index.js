import { get, defaults } from 'lodash'
import Base from 'deepstream.io'
import RedisCacheConnector from 'deepstream.io-cache-redis'
import RedisMessageConnector from 'deepstream.io-msg-redis'
import { colorize } from '../util.js'

import * as permissions from './permissions'

export const constants = Base.constants

export class Deepstream extends Base {
  static constants = constants;

  constructor(params = {}, context = {}) {
    let { project, argv } = context
    let settings = project.settings.server

    let options = defaults(params, {
      ...(get(settings,`${params.profile}.${params.env}.deepstream`) || {})
    })

    defaults(options, {
      port: 6020,
      host: 'localhost',
      cachePort: 6379,
      cacheHost: 'localhost',
      start: false,
      env: process.env.NODE_ENV || 'development',
      permissions
    })

    defaults(options, {
      tcpPort: options.port + 1,
      tcpHost: options.host
    })

    super(`${ options.host }:${ options.port }`)

    let { cachePort, cacheHost } = options
    let { isValidUser, canPerformAction } = options.permissions

    this.set('showLogo', false)

    this.set('cache', new RedisCacheConnector({
      port: cachePort,
      host: cacheHost
    }))

    this.set('host', options.host)
    this.set('port', options.port)
    this.set('tcpHost', options.tcpHost || options.tcpPort || options.port + 1)
    this.set('tcpPort', options.tcpPort || options.port || 6021)

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

export default Deepstream