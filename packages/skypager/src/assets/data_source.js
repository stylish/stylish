import Asset from './asset'

const EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

class DataSource extends Asset {
  constructor (uri, options = {}) {
    super(uri, options)
  }

  get data () {
    return this.transformed
  }

  parser (content, asset) {
    content = content || this.raw || ''

    if (this.requireable) {
      return require(this.paths.absolute)

    } else if (this.extension === '.yml') {
      return require('js-yaml').safeLoad(content || '')
    } else if (this.extension === '.csv') {
      console.log('CSV parsing not yet implemented')
    } else {
      throw ('Implement parser for ' + this.extension + ' ' + content.length)
    }
  }

  indexer (parsed) {
    return parsed
  }

  transformer (indexed) {
    return indexed
  }
}

DataSource.EXTENSIONS = EXTENSIONS
DataSource.GLOB = GLOB

exports = module.exports = DataSource
