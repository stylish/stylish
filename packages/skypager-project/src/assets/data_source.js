import Asset from './asset'
import * as util from '../util'

import get from 'lodash/result'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import defaults from 'lodash/defaultsDeep'

const { clone, pick, result, noConflict } = util

const EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

export class DataSource extends Asset {
  static EXTENSIONS = EXTENSIONS;

  static GLOB = GLOB;

  constructor (uri, options = {}) {
    super(uri, options)

    this.lazy('parsed', () => this.parse(this.raw))
    this.lazy('indexed', () => this.index(this.parsed, this))
    this.lazy('transformed', () => this.transform(this.indexed, this))
    this.lazy('data', this.getData, true)

    this.indexer = options.indexer || ((val) => val)
    this.transformer = options.transformer || ((val) => val)
  }

  defaults(...args) {
    return defaults(this.data, ...args)
  }

  pick(...args) {
    return pick(this.data, ...args)
  }

  get(...args) {
     return get(this.data, ...args)
  }

  _get(...args){
    return get(this, ...args)
  }

  update(...args) {
    return this.set(...args).save()
  }

  saveSync(...args) {
    return this.set(...args).save()
  }

  set(key, value) {
    if (!value && isObject(key)) {
      Object.keys(key).forEach(k => {
        this.set(k, key[k])
      })
      return this
    }

    if(isString(key)) {
      set(this.data, key, value)
    }

    return this
  }

  result(...args) {
    return result(this.data, ...args)
  }

  getData () {
    if (this.extension !== '.js' && (!this.raw || this.raw.length === 0)) {
      this.runImporter('disk', {asset: this, sync: true})
    }

    return this.indexed
  }

  saveSync (options = {}) {
    if (this.raw || this.raw.length === 0) {
      if (!options.allowEmpty && isEmpty(this.data)) {
        return false
      }
    }

    if (this.extension === '.json') {
      this.raw = !options.minify
        ? JSON.stringify(this.data, null, 2)
        : JSON.stringify(this.data)
    } else if (this.extension === '.yml') {
      this.raw = require('yaml').dump(this.data)
    }

    return require('fs').writeFileSync(
       this.paths.absolute,
       this.raw,
       'utf8'
    )
  }

  save (options = {}) {
    if (this.raw || this.raw.length === 0) {
      if (!options.allowEmpty && isEmpty(this.data)) {
        return false
      }
    }

    if (this.extension === '.json') {
      this.raw = !options.minify
        ? JSON.stringify(this.data, null, 2)
        : JSON.stringify(this.data)
    } else if (this.extension === '.yml') {
      this.raw = require('yaml').dump(this.data)
    }

    return require('fs-promise').writeFile(
       this.paths.absolute,
       this.raw,
       'utf8'
    )
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

export default DataSource

function handleScript (datasource, load) {
  let locals = {
    util,
    datasource,
    project: datasource.project
  }

  return noConflict(function(){
    let exp = load()

    if (typeof exp === 'function') {
       return exp.call(datasource, datasource, datasource.project)
    } else {
      return exp
    }
  }, locals)()
}

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
