import DataSource from './data_source'

const EXTENSIONS = ['json']
const GLOB = '*/package.json'

export class ProjectManifest extends DataSource {

  static EXTENSIONS = EXTENSIONS;
  static GLOB = GLOB;

  constructor (uri, options = {}) {
    super(uri, options)
  }

  get name() {
    return this.data.name
  }

  get version() {
    return this.data.version
  }

  get version() {
    return this.data.version
  }

  get repository() {
    return this.data.repository
  }

  get scripts() {
    return this.data.scripts
  }

  get skypager() {
    return this.data.skypager
  }
}

export default ProjectManifest
