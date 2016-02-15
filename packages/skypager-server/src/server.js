import { values, defaultsDeep as defaults } from 'lodash'
import Deepstream from './deepstream'
import { shell, colorize } from './util.js'
import { Streamer } from './streamer'
import { dashboard } from './dashboard/index'

export class Server {
  constructor (project, config = {}) {
    let server = this

    this.project = project
    this.config = config

    defineProperty(server, 'processes', {
      enumerable: false,
      value: {}
    })

    this.streamer = new Streamer({
      root: project.join('log')
    })

    this.prepare()

    process.on('exit', () => {
      shell(`rm -rf ${ streamer.root }/streamer-*.log`)
    })
  }

  start() {
    if (this.config.dashboard) {
      dashboard(this, this.config.dashboard)
    }

    values(this.config.processes).forEach(p => p.startFn.call(this))
  }

  prepare() {
    Object.keys(this.config.processes).forEach(name => {
      let cfg = this.config.processes[name]
      cfg.name = name

      if (cfg.type && cfg.type === 'deepstream') {
        if (this.config.dashboard) {
          cfg.paths = cfg.paths || {}
          cfg.paths.serverLog = this.project.path('logs','streamer-backend.log')
          cfg.paths.errorLog = this.project.path('logs', 'streamer-backend.log')
        }

        defineProperty(this, 'deepstream', {
          enumerable: false,
          configurable: false,
          value: setupDeepstream(this, cfg)
        })

        cfg.startFn = () =>
          this.deepstream.start()

      } else if (cfg.cmd) {

        cfg.startFn = function(){
          let output = this.streamer.write(name)

          output.on('open', () => {
            this.processes[name] = spawn(cfg.cmd, {
              ...cfg,
              stdio:[
                'ignore',
                output,
                output
              ]
            })
          })
        }
      }
    })

  }
}

export default Server

const { defineProperty, getOwnPropertyDescriptor } = Object

function setupDeepstream(server, cfg) {
  return new Deepstream(cfg, {project: server.project})
}

function spawn(cmd, options = {}) {
  let proc = shell(cmd, options)

  process.on('exit', () => {
    try { proc.kill() } catch (e) {  }
  })

  return proc
}
