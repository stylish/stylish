import Dashboard from './dashboard'
import Streamer from './streamer'
import Runner from './runner'
import Server from './server'
import { colorize } from './util'
import { defaultsDeep as defaults, get, set } from 'lodash'

export function start(params = {}, context = {}) {
  let { project } = context
  params.env = params.env || process.env.NODE_ENV || 'development'

  let config = defaults(buildOptions(params, context), params)
  let server = new Server(project, config)

  server.start()
}

export default start

const processes = {
  preview: {
    cmd: 'skypager dev --port 3000 --proxy-target="localhost:6020" --proxy-path="/engine.io"'
  },
  deepstream: {
    cmd: 'skypager serve deepstream --host localhost --port 6020'
  },
  ngrok: {
    cmd: 'ngrok http 3000'
  }
}


function buildOptions(params, context) {
  let { project, options } = context
  let { profile, env } = params

  let current = get(project.settings, `server.${ profile }`)

  if (!current) {
    if(project.settings.server.defaultProfile || Object.keys(project.settings.server)[0]) {
      profile = (project.settings.server.defaultProfile || Object.keys(project.settings.server)[0])
    }

    if(current = get(project.settings, `server.${ profile }`)) {
      console.log(`Using profile: ${ profile }`)
    }
  }

  let config = get(project.settings, `server.${ profile }.${ env }`) || {}

  return config || { processes, env }
}



