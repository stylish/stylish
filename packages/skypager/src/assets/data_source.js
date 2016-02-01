import Asset from './asset'
import * as util from '../util'

const EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

class DataSource extends Asset {
  constructor (uri, options = {}) {
    super(uri, options)

    this.lazy('parsed', () => this.parse(this.raw))
    this.lazy('indexed', () => this.index(this.parsed, this))
    this.lazy('transformed', () => this.transform(this.indexed, this))
    this.lazy('data', this.getData, true)

    this.indexer = options.indexer || ((val) => val)
    this.transformer = options.transformer || ((val) => val)
  }

  getData () {
    if (this.extension !== '.js' && (!this.raw || this.raw.length === 0)) {
      this.runImporter('disk', {asset: this, sync: true})
    }

    return this.indexed
  }

  parser (content, asset) {
    content = content || this.raw || ''

    if (this.extension === '.js') {
      return handleScript.call(this, this, () => require(this.paths.absolute))
    } else if(this.extension === '.json') {
      return JSON.parse(content || '{}')
    } else if (this.extension === '.yml') {
      return require('js-yaml').safeLoad(content || '')

    } else if (this.extension === '.csv') {
      return []
    } else {

      throw ('Implement parser for ' + this.extension + ' ' + content.length)
    }
  }
}

DataSource.EXTENSIONS = EXTENSIONS
DataSource.GLOB = GLOB

exports = module.exports = DataSource

function handleScript (datasource, load) {
  let locals = {
    util,
    datasource,
    project: datasource.project
  }

  return util.noConflict(function(){
    let exp = load()

    if (typeof exp === 'function') {
       return exp.call(datasource, datasource, datasource.project)
    } else {
      return exp
    }
  }, locals)()
}
