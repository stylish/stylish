import { join, resolve, dirname } from 'path'
import { createWriteStream as writeable, createReadStream as readable, openSync, existsSync as exists } from 'fs'

import { pick, set, values, mapValues, get, defaultsDeep as defaults } from 'lodash'
import { defineProp, colorize, spawn } from './util.js'

import mkdirp from 'mkdirp'
import rimraf from 'rimraf'

import winston from 'winston'

import { express } from './server/express'
import dashboard from './dashboard'

export class Server {
  constructor(params = {}, context = {}) {
    let { project, argv } = context
    let { env, profile, dashboard } = params

    let server = this

    this.dashboard = dashboard
    this.debug = argv && argv.debug || require('yargs').argv.debug

    defaults(server, {
      env,
      profile,
      project
    }, {env: 'development', profile: 'web'})

    let config = get(project, `settings.server.${profile}.${env}`) || defaultSettings[profile][env] || {}

    defineProp(server, 'config', defaults({}, config, {processes:{}}))
    defineProp(server, 'processes', mapValues(config.processes, (cfg, name) => (cfg.name = name) && cfg))

    server.paths = {
      logs: project.path('logs', 'server'),
      public: project.paths.public
    }

    if (env === 'development') {
      rimraf.sync(server.paths.logs, {})
    }

    values(server.paths).forEach(path => {
      mkdirp.sync(path)
    })

    server.state = {
      processes: {}
    }

    server.logger = new winston.Logger({
      level: 'debug',
      get transports() {
        let t = []

        if(!this.dashboard) {
          t.push(
            new winston.transports.Console({
              level: 'debug',
              colorize: true
            })
          )
        }

        t.push(
          new winston.transports.File({
            name: 'server-log',
            filename: join(server.paths.logs, `server.${env}.log`),
            level: this.debug ? 'debug' : 'info',
            colorize: true
          })
        )

        return t
      }
    })
  }

  start () {
    this.prepare()
    this.run()
    this.listen()

    if (this.dashboard && this.config.dashboard) {
      dashboard(this, this.config.dashboard)
    }
  }

  listen (options = {}) {
    defaults(options, {
      port: this.config.port || 8080,
      host: this.config.host || '0.0.0.0'
    })

    let app = express(this, options)

    let {host, port} = options

    this.log('info', 'express app starting', options)

    app.listen(port, host, (err) => {
      if(err) {
        this.log('error', 'error launching espress', {
          err
        })
      }
    })
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
          this.debug ? 'inherit' : proc.output,
          this.debug ? 'inherit' : proc.output
        ]
      })

      spawn(proc.cmd, opts)
      .progress((child) => {
        this._processes[proc.name] = child

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

    process.on('uncaughtException', () => {
      this.log('error', 'uncaught exception: shutting down...')

      values(this._processes).forEach(proc => {
        this.log('info', 'killing child process', proc && proc.pid)

        if(proc) {
          proc.kill()
        }
      })

      process.exit(1)
    })

    process.on('exit', () => {
      this.log('info', 'shutting down...')

      values(this._processes).forEach(proc => {
        this.log('info', 'killing child process', proc && proc.pid)
        if(proc) {
          proc.kill()
        }
      })
    })

    this.log('info', 'server started: ' + process.pid, this.processes)

    process.title = 'skypager-server'
  }

  /**
  * The output on stdout for each of the processes we spawn will be streamed
  * to a log file. The dashboard can stream this for visual purposes, or it can
  * be analyzed elsewhere.
  */
  prepare() {
    this.eachProcess((proc) => {
      let output = stream(this.logPath(`${ proc.name }.${ this.env }.log`))
      defineProp(proc, 'output', output)
      output.open()
    })
  }

  eachProcess(fn) {
    values(this.processes).forEach(fn)
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
