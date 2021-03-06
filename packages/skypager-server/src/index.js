import { defaultSettings } from './server'

export const defaultServerSettings = defaultSettings

export function dashboard(params, context={}) {
  const Dashboard = require('./dashboard').Dashboard
  let proc = new Dashboard(params, context)

  proc.start()

  return proc
}

export function deepstream(params = {}, context = {}) {
  const Deepstream = require('./deepstream').Deepstream
  let proc = new Deepstream(params, context)

  proc.start()

  return proc
}

export function server(params = {}, context = {}) {
  const Server = require('./server').Server

  try {
    let proc = new Server(params, context)
    proc.start()
    return proc
  } catch (error) {
    console.log('Error starting server', error.message, error.stack)
  }
}
