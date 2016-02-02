import { join } from 'path'
import electronify from 'electronify-server'

const DEFAULT_HOST = 'localhost'
const DEFAULT_PORT = 3000

export class Application {
  static boot (options = {}) {
    let app = new Application(options)

    if (process.env.NODE_ENV !== 'production') {
      app.devProcess('main')
    }

    return app
  }

  constructor (options = {}) {
    this.options = options
    this.windows = {}
    this.processes = {}
  }

  get developmentUrl () {
    let { host, port } = this.options
    return `http://${ host || DEFAULT_HOST }:${ port || DEFAULT_PORT }`
  }

  devProcess (name = this.nextWindowName, options = {}) {
    console.log('running the dev process')
    electronify({
      url: `file://${  join(process.env.PWD, 'public', 'index.html') }`,
      noServer: true,
      window: {
        height: options.height || 960,
        width: options.width || 1440
      },

      ready (app) {
        options.ready && options.ready(app)
      },

      preLoad (app, win) {
        options.preLoad && options.preLoad(app, win)

      },
      postLoad (app, win) {
        options.postLoad && options.postLoad(app, win)
      }
    })
  }

  get nextWindowName () {
    return `window-${ Object.keys(this.windows).length }`
  }
}

export default Application
