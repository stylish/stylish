import { get, defaults } from 'lodash'
import Base from 'deepstream.io'
import { colorize } from '../util.js'

import * as permissions from './permissions'

export const constants = Base.constants

export class Deepstream extends Base {
  static constants = constants;

  constructor(options = {}, context = {}) {
    let { project, argv } = context

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

    this.set('host', options.host)
    this.set('port', options.port)
    this.set('tcpHost', options.tcpHost || options.tcpPort || options.port + 1)
    this.set('tcpPort', options.tcpPort || options.port || 6021)

    if (options.backend === 'redis') {
      const RedisCacheConnector = require('../../vendor/deepstream.io-cache-redis/')
      const RedisMessageConnector = require('../../vendor/deepstream.io-msg-redis/')

      this.set('cache', new RedisCacheConnector({
        port: cachePort,
        host: cacheHost
      }))

      this.set('messageConnector', new RedisMessageConnector({
        port: cachePort,
        host: cacheHost
      }))
    }

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
