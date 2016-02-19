import _express from 'express'
import winston from 'winston'
import expressWinston from 'express-winston'
import proxyMiddleware from 'http-proxy-middleware'

export function express(server, options = {}) {
  const app = _express()
  const config = server.config

  if (config.deepstream) {
    setupDeepstreamProxy(app, config.deepstream, server)
  }

  app.use(
    express.static(server.paths.public)
  )

  if (config.api) {
    setupExpressAPI(app, config.api, server)
  }

  if (config.webpack) {
     setupWebpackProxy(app, config.webpack, server)
  }

  return app
}

export default express

function setupWebpackProxy(app, { host = 'localhost', port=3000, proto='http' }){
  let target = `${proto}://${ config.host }:${ config.port }`

  app.use(
    proxyMiddleware('/', {
      target,
      ws: true
    })
  )
}

function setupDeepstreamProxy(app, { host, port, proto='http' }) {
  let root = config.path || '/engine.io'
  let target = `${proto}://${ config.host }:${ config.port }`

  app.use(
    proxyMiddlware(root, {
      target,
      ws: true
    })
  )
}

function setupExpressApi(){

}
