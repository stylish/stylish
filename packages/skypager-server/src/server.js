import { pick, set, values, mapValues, get, defaultsDeep as defaults } from 'lodash'
import { defineProp, colorize, spawn } from './util.js'
import { dashboard } from './dashboard/index'
import { createOutputStream as stream} from 'fs-extra'
import { join, resolve } from 'path'
import mkdirp from 'mkdirp'

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
      logs: project.path('logs', 'server')
    }

    values(this.paths).forEach(path => {
      mkdirp.sync(path)
    })

    this.state = {
      processes: {}
    }

    this.logger = argv.debug
      ? process.stdout
      : stream(join(this.paths.logs, `server.${env}.log`))
  }

  start () {
    const updateProcess = this.updateProcess.bind(this)

    defineProp(this, '_processes', {})

    this.eachProcess((proc) => {
      let opts = pick(proc, 'env', 'cwd', 'detached', 'uid', 'gid', 'stdio')

      defaults(opts, {
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
        proc.kill()
      })
    })

    this.log('info', 'server started: ' + process.pid, this.processes)

    process.title = 'skypager-server'
  }

  prepare() {
    this.eachProcess((proc) => {
      proc.output = stream(this.logPath(`${ process.name }.${ this.env }.log`))
    })
  }

  eachProcess(fn) {
    values(this.processes).forEach(fn)
  }

  updateProcess(name, data = {}) {
    let current = get(this, `state.processes.${name}`) || {}
    let updated = current = Object.assign(current, data)

    set(this, `state.processes.${ name }`, updated)

    this.log('info', 'updated process', current)
  }

  log (level, message, data = {}) {
    this.logger && this.logger.write(colorize({
       level,
       message,
       data
    }) + "\n\n")
  }

  logPath(...args) {
     return project.path('logs', 'server', ...args)
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
