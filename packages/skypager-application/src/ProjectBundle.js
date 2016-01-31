module.exports =
class ProjectBundle {
  constructor (bundle, options = {}) {
    hide(this, {
      bundle
    })

    if (options.computed) {
      assign(this, options.computed)
    }
  }

  query (source, params) {
    source = `${ source }`.toLowerCase()

    if (this.entityNames.indexOf(source) > 0) {
      return filterQuery(values(this.entities[source]), params)
    }
  }

  get settings() {
    let sources = keys(this.data).filter(key => key.match(/^settings/))
    return sources.reduce((memo,key)=>{
      let source = this.data[key]
      return memo = assign(memo, source.data)
    }, {})
  }

  get docs () {
    return this.content.docs
  }

  get data () {
    return this.content.data_sources
  }

  get assets () {
    return this.bundle.assets
  }

  get content () {
    return this.bundle.content
  }

  get entities () {
    return this.bundle.entities
  }

  get entityNames () {
    return keys(this.entities)
  }

  get models () {
    return this.bundle.models || {}
  }

  get project () {
    return this.bundle.project
  }
}

function hide(obj, props = {}) {
  keys(props).forEach(key => {
    let value = props[key]

    defineProperty(obj, key, {
      enumerable: false,
      value
    })
  })
}

function filterQuery (list = [], params) {
  if ( typeof params === 'function' ) {
    return list.filter(params)
  }

  return (list || []).filter(item => {
    return keys(params).every(key => {
      let param = params[key]
      let value = item[key]

      if (isRegex(param) && param.test(value)) {
        return true
      }

      if (typeof (param)==='string' && value === param) {
        return true
      }

      if (typeof (param)==='number' && value === param) {
        return true
      }

      // treat normal arrays to search for any exact matches
      if (isArray(param)) {
        return param.any(val => val === value)
      }
    })
  })
}

function values(obj) {
   return keys(obj).map(k => obj[k])
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof(val)) === 'object' && Object.getPrototypeOf(val).toString() === '/(?:)/') {
    return true;
  }

  return false;
}

const { defineProperty, keys, assign } = Object
