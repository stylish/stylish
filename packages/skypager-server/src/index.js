import Dashboard from './dashboard'
import { defaultSettings, Server } from './server'
import Deepstream from './deepstream'

export const defaultServerSettings = defaultSettings

export function dashboard(params, context={}) {
  let dashboard = new Dashboard(params, context)

  dashboard.start()

  return dashboard
}

export function deepstream(params = {}, context = {}) {
  let deepstream = new Deepstream(params, context)

  deepstream.start()

  return deepstream
}

export function server(params = {}, context = {}) {
  let server = new Server(params, context)

  server.start()

  return server
}
