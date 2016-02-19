import { pick, set, values, mapValues, get, defaultsDeep as defaults } from 'lodash'
import { defineProp, colorize, spawn } from './util.js'
import { join, resolve, dirname } from 'path'
import mkdirp from 'mkdirp'
import { createWriteStream as writeable, createReadStream as readable, openSync, existsSync as exists } from 'fs'

import winston from 'winston'

export class Server {
  constructor(params = {}, context = {}) {
    let { project, argv } = context
    let { env, profile } = params

    argv = argv || require('yargs').argv

    defaults(this, {
      env,
      profile,
      project
    }, {env: 'development', profile: 'web'})

    let config = get(project, `settings.server.${profile}.${env}`) || defaultSettings[profile][env] || {}

    defineProp(this, 'config', defaults({}, config, {processes:{}}))
    defineProp(this, 'processes', mapValues(config.processes, (cfg, name) => (cfg.name = name) && cfg))

    this.paths = {
      logs: project.path('logs', 'server'),
      public: project.paths.public
    }

    values(this.paths).forEach(path => {
      mkdirp.sync(path)
    })

    this.state = {
      processes: {}
    }

    project.logger.add(winston.transports.File,{
      name: 'server-logger',
      level: 'debug',
      filename: join(this.paths.logs, `server.${ env }.log`)
    })

    this.logger = project.logger
  }

  start () {
    this.prepare()
    this.run()
    this.listen()
  }

  listen (options = {}) {
    defaults(options, {
      port: this.config.port || 8080,
      host: this.config.host || '0.0.0.0'
    })

    let {host, port} = options
  }

  run () {
    const updateProcess = this.updateProcess.bind(this)

    defineProp(this, '_processes', {})

    this.eachProcess((proc) => {
      if (!proc) { return }

      let opts = pick(proc, 'env', 'cwd', 'detached', 'uid', 'gid', 'stdio')

      opts = defaults(opts, {
        stdio:[
          'ignore',
          proc.output,
          proc.output
        ]
      })

      spawn(proc.cmd, opts)
      .progress((child) => {
        this._processes[proc.name] = child

        child.title = 'skypager-server: ' + proc.name

        updateProcess(proc.name, {
          pid: child.pid,
          status: 'running',
          ...proc
        })
      })
      .then(result => {
        updateProcess(proc.name, {
          status: 'finished',
          ...proc
        })
      })
      .fail(err => {
        updateProcess(proc.name, {
          status: 'failure',
          ...proc,
          err
        })
      })
    })

    process.on('exit', () => {
      values(this._processes).forEach(proc => {
        if(proc) {
          proc.kill()
        }
      })
    })

    this.log('info', 'server started: ' + process.pid, this.processes)

    process.title = 'skypager-server'
  }

  prepare() {
    this.eachProcess((proc) => {
      if(!proc) { return }
      defineProp(proc, 'output', stream(this.logPath(`${ proc.name }.${ this.env }.log`)))
      proc.output.open()
    })
  }

  eachProcess(fn) {
    values(this.processes).forEach((proc, index) => {
      if(proc) {
        fn(proc, index)
      } else {
      }
    })
  }

  updateProcess(name, data = {}) {
    let current = get(this, `state.processes.${name}`) || {}
    let updated = current = Object.assign(current, data)

    set(this, `state.processes.${ name }`, updated)

    this.log('debug', 'updated process', current)
  }

  log (level, ...args) {
    this.logger.log(level, ...args)
  }

  logPath(...args) {
     return this.project.path('logs', 'server', ...args)
  }
}

export default Server

export const defaultSettings = {
  web: {
    development: {
      processes: {
        devserver: {
          cmd: 'skypager dev --bundle'
        }
      }
    }
  }
}


const { keys, defineProperty, getOwnPropertyDescriptor } = Object

function stream(path) {
  mkdirp.sync(dirname(path))
  let fd = openSync(path, 'a+')
  return writeable(path, {fd: fd})
}
