import { join } from 'path'
import electronify from 'electronify-server'

const DEFAULT_HOST = 'localhost'
const DEFAULT_PORT = 3000

export class Application {
  static boot (options = {}) {
    let app = new Application(options)

    app.startProcess('main')

    return app
  }

  constructor (options = {}) {
    this.options = options
    this.windows = {}
    this.processes = {}
  }

  get developmentUrl () {
    let { host, port } = this.options
    `http://${ host || DEFAULT_HOST }:${ port || DEFAULT_PORT }`
  }

  startProcess (name = this.nextWindowName, options = {}) {
    console.log('yo yo')

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
