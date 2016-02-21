import _express from 'express'
import winston from 'winston'
import expressWinston from 'express-winston'
import proxyMiddleware from 'http-proxy-middleware'
import defaults from 'lodash/defaults'

export function express(server, options = {}) {
  const app = _express()
  const config = server.config

  if(!config) {
    throw('no config')
  }

  if (config.webstream) {
    setupWebstreamProxy(
      app,
      defaults({}, config.webstream, {
        path: '/webstream/' + config.webstream.channel,
        port: 5000
      }),
      server
    )
  }

  if (config.deepstream) {
    setupDeepstreamProxy(
      app,
      defaults({}, config.deepstream,{
        path: '/engine.io',
        port: 6020,
        host: '0.0.0.0'
      }),
      server
    )
  }

  app.use(
    _express.static(server.paths.public)
  )

  if (config.api) {
    setupExpressAPI(
      app,
      defaults({}, config.api,{ }),
      server
    )
  }

  if (config.webpack) {
     setupWebpackProxy(
       app,
       config.webpack,
       server
     )
  }

  return app
}

export default express

function setupWebstreamProxy(app, { path='/', host = 'localhost', port=5000, proto='http' }, server){
  let target = `${proto}://${ host }:${ port }`

  app.use(
    proxyMiddleware(path, {
      target,
      ws: true,
      logProvider: function() {
         return server.logger
      }
    })
  )
}

function setupWebpackProxy(app, { path='/', host = 'localhost', port=3000, proto='http' }, server){
  let target = `${proto}://${ host }:${ port }`

  app.use(
    proxyMiddleware(path, {
      target,
      ws: true,
      logProvider: function() {
         return server.logger
      }
    })
  )
}

function setupDeepstreamProxy(app, { path='/engine.io', host, port, proto='http' }, server) {
  let target = `${proto}://${ host }:${ port }`

  app.use(
    proxyMiddleware(path, {
      target,
      ws: true,
      logProvider: function() {
         return server.logger
      }
    })
  )
}

function setupExpressApi(){

}
