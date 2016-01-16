import { tabelize, pluralize, singularize, parameterize, noConflict, assign, hide, lazy, values, slugify, underscore } from '../../util'

let tracker = { }
let _curr

function current () { return tracker[_curr] }
function clearDefinition () { _curr = null; delete tracker[_curr] }

export class ModelDefinition {
  constructor (description, options = {}, body) {
    this.description = description
    this.name = description

    if (!body && typeof (options)==='function') {
      body = options
      options = {}
    }

    this.body = body.bind(this)
    this.options = options

    this.config = {}

    if(options.required && options.required.definition){
      this.config = Object.assign(this.config, options.required.definition)
    }

    hide.getter(this, 'documents', this.configureDocuments.bind(this))
    hide.getter(this, 'data_sources', this.configureDataSources.bind(this))

    hide.getter(this, 'api', () => {
      return {
        create: this.config.creator || this.helperExport.create || defaultCreateMethod,
        validate: this.config.validator || this.helperExport.validate || defaultValidateMethod,
        runner: this.config.creator || this.helperExport.create || defaultCreateMethod,
        config: Object.assign({}, this.config, this.helperExport.config || {})
      }
    })
  }

  creator(fn){
    this.config.creator = fn
  }

  validator(fn){
    this.config.validator = fn
  }

	get documentConfig () {
	  return this.config.documents
	}

	get sectionsConfig () {
	  return this.documentConfig && this.documentConfig.sectionsConfig
	}

  configure () {
    this.body(this)
    this.documents.configure()
  }

	configureDocuments () {
	  return this.config.documents = this.config.documents || new DocumentConfiguration(this)
	}

	configureDataSources () {
	  return this.config.data_sources = this.config.data_sources || new DataSourceConfiguration(this)
	}
}

class DocumentConfiguration {
	constructor (modelDefinition) {
  hide.getter(this, 'parent', modelDefinition)

  var sectionsConfig = {}

  this.config = {
      get sections () {
        return sectionsConfig
      }
    }

  createChainMethods(this, 'a', 'has', 'have', 'many')
	}

	get sectionsConfig () {
		  return this.config.sections
	}

  configure () {
    values(this.config.sections).forEach(section => section.configure())
  }

  sections (groupName, options = {}, mapFn) {
    if (!mapFn && typeof (options)==='function') {
       mapFn = options
       options = {}
     }

    options.type = 'map'
    options.parent = this
    this.config.sections[underscore(groupName)] = new SectionConfiguration(groupName, options, mapFn)
  }

	section (sectionIdentifier, options = {}, buildFn) {
  if (!buildFn && typeof (options)==='function') {
       buildFn = options
       options = {}
     }

  options.type = 'builder'
  options.parent = this
  this.config.sections[underscore(sectionIdentifier)] = new SectionConfiguration(sectionIdentifier, options, buildFn)
	}
}

/**
* Sections are configured individually by name
*/
class SectionConfiguration {
	constructor (sectionIdentifier, options = {}, body) {
		  this.name = sectionIdentifier

  if (!body && typeof (options)==='function') {
      body = options
      options = {}
    }

  this.body = body.bind(this)
		  this.builderType = options.type || 'builder'

  let articlesConfig = {}

  this.config = {
    get articles () {
      return articlesConfig
    }
  }

  hide.getter(this, 'parent', options.parent)

  createChainMethods(this, 'a', 'has', 'have', 'many')
	}

	get slug () {
  return slugify(this.name)
	}

  configure () {
	  this.body(this)
    values(this.config.articles).forEach(article => article.configure && article.configure())
  }

  article (name, options = {}, articleBuilder) {
    options.type = 'builder'
    options.parent = this
    return this.config.articles[underscore(name)] = new ArticleConfiguration(name, options, articleBuilder)
  }

  articles (name, options = {}, articleBuilder) {
    options.type = 'map'
    options.parent = this
    return this.config.articles[underscore(name)] = new ArticleConfiguration(name, options, articleBuilder)
  }
}

class ArticleConfiguration {
	constructor (groupName, options = {}, body) {
		  this.name = groupName

  if (!body && typeof (options)==='function') {
      body = options
      options = {}
    }

		  this.builderType = options.type || 'map'
  this.body = body.bind(this)

  createChainMethods(this, 'a', 'has', 'have', 'many')
	}

	get slug () {
		  return slugify(this.name)
	}

  configure () {
		    this.body(this)
  }
}

class DataSourceConfiguration {
	constructor (modelDefinition) {
	}
}

export function DSL (fn) {
  noConflict(fn, DSL)()
}

assign(DSL, {
  assign,
  singularize,
  pluralize,
  slugify,
  current,
  underscore,
  tabelize,
  lazy,
  describe,
  model: describe,
  define: describe,
  validate(...args){
    tracker[_curr].validator(...args)
  },
  validator(...args){
    tracker[_curr].validator(...args)
  },
  creator(...args){
    tracker[_curr].creator(...args)
  },
  create(...args){
    tracker[_curr].creator(...args)
  },
  attributes(...args){
    tracker[_curr].attributes(...args)
  }
})

export function lookup(modelName) {
  return tracker[(_curr = tabelize(parameterize(modelName)).toLowerCase())]
}

function describe (modelName, fn) {
  return tracker[(_curr = tabelize(parameterize(modelName)).toLowerCase())] = new ModelDefinition(modelName, fn)
}

function createChainMethods (target, ...methods) {
	  methods.forEach(method => {
		  Object.defineProperty(target, method, {
			  configurable: true,
			  get: function () {
				  return target
			}
		})
	})
}

function defaultCreateMethod(asset, options = {}){
  return {
    id: asset.id,
    uri: asset.uri,
    metadata: asset.data,
    content: asset.content.toJSON()
  }
}

function defaultValidateMethod(asset, options = {}){
  return true
}

ModelDefinition.current = current
ModelDefinition.clearDefinition = clearDefinition
