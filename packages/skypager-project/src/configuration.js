import { resolve, join, dirname } from 'path'
import { mkdirpSync, readFileSync, existsSync } from 'fs'
import { assign, hide, clone } from './util'

import convict from 'convict'

const SkypagerFolder = '.skypager'

module.exports =

class Configuration {
  constructor (host) {
    hide.getter(this, 'host', host)
  }

  get (value) {
    return this.convict.get(value)
  }

  get convict () {
    return convict(this.schema)
  }

  get schema () {
    let schema = {
      env: {
        doc: 'The application environment',
        format: ['development', 'production', 'test'],
        default: 'development',
        env: 'NODE_ENV',
        arg: 'env'
      },
      plugins_path: {
        doc: 'Path to plugins',
        default: join(this.homeDir, SkypagerFolder, 'plugins'),
        env: 'SKYPAGER_PLUGINS_PATH',
        arg: 'plugins-path'
      }
    }

    this.host.enabledPlugins.forEach(pluginName => {
      let pluginHelper = this.host.plugins.lookup(pluginName)

      if (pluginHelper.api.provides('configuration')) {

      }
    })

    return schema
  }

  get homeDir () {
    return process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
  }
}
