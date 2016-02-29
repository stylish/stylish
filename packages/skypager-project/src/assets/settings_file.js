import DataSource from './data_source'

import get from 'lodash/get'
import clone from 'lodash/clone'
import result from 'lodash/result'

const EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

export class SettingsFile extends DataSource {

  static EXTENSIONS = EXTENSIONS;
  static GLOB = GLOB;

  constructor (uri, options = {}) {
    super(uri, options)

    this.indexer = parseSettings.bind(this)
  }

  /*
   * This lets us write less nested
   * versions of a settings file
   */
  getData() {
    if (this.extension !== '.js' && (!this.raw || this.raw.length === 0)) {
      this.runImporter('disk', {asset: this, sync: true})
    }

    let value = this.indexed
    let parts = this.id.split('/')
    let last = parts[ parts.length - 1]

    if (value[last] && keys(value).length === 1) {
      value = value[last] || {}
    }

    if (get(value,process.env.NODE_ENV)) {
      value = get(value, process.env.NODE_ENV)
    }

    return value
  }
}

export default SettingsFile

function interpolateValues (obj, template) {
  let datasource = this

  Object.keys(obj).forEach(key => {
    let value = obj[key]

    if (typeof value === 'object') {
      interpolateValues.call(datasource, value, template)
    } else if (typeof value === 'string' && value.match(/^env\.\w+$/i)) {
      value = `<%= process.${ value } %>`
      obj[key] = template(value)(value)
    } else if (typeof value === 'string' ) {
      obj[key] = template(value)(value)
    }
  })

  return obj
}


function parseSettings (val = {}) {
  return interpolateValues.call(this, clone(val), this.templater.bind(this))
}

const { keys } = Object
