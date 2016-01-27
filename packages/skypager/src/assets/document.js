import Asset from './asset'

import { carve, assign, singularize, pluralize, isArray } from '../util'
import parser from './document/parser'
import indexer from './document/indexer'
import transformer from './document/transformer'
import content_interface from './document/content_interface'
import * as query_interface from './document/query_interface'

import { DomWrapper } from './parsers/html'

import cache from './document/cache'

const EXTENSIONS = ['md', 'markdown', 'markd']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

class Document extends Asset {
  constructor (uri, options = {}) {
    super(uri, options)

    this.lazy('content', () => content_interface(this, this), false)

    this.parser = parser
    this.indexer = indexer
    this.transformer = transformer

    this.lazy('parsed', () => this.parse(this.raw))
    this.lazy('indexed', () => this.index(this.parsed, this))
    this.lazy('transformed', () => this.transform(this.indexed, this))
  }

  assetWasImported () {
    if (this.modelClass) {
      this.decorate()
      this.loadEntity()
    }
  }

  decorate () {

  }
  /**
   * Convert this document into an Entity and load it into the store
  */
  loadEntity () {
    let asset = this
    var entity

    this.ensureIndexes()

    try {
      entity = this.modelClass.run({ document: this, asset: this }, {project: this.project})
    } catch (error) {
      console.log(`Error building entity from document: ${ this.id }: ${ error.message }`)
    }

    return this.modelClass.entities[this.id] = Object.assign({}, entity, {
        get path () {
            return asset.paths.projectRequire
        },
        get id () {
           return asset.id
        }
    })
  }

  get html() {
      let asset = this
      let html = this.project.run.renderer('html', {asset})
      return DomWrapper(html, this)
  }

  get $() {
    return this.html.css
  }

  get selector() {
    return this.html.css
  }

  get modelClass () {
    return this.project.resolve.model(this) || this.project.models.lookup('page')
  }

  get modelDefiniton () {
    return this.modelClass && this.modelClass.definition
  }

  get metadata() {
      return this.frontmatter
  }

  get data () {
      return this.frontmatter || {}
  }

  get relatedData () {
    let relData = { }

    if (this.relatedDatasources.length > 0) {
      this.relatedDatasources.forEach(dataSource => {
        let related = dataSource.data || {}
        let relativeId = dataSource.id.replace(this.id, '').replace(/^\//, '').replace(/\//g, '.')

        if (relativeId === '') {
          if (Array.isArray(dataSource.data)) {
            relData.related = relData.related || []
            relData.related = relData.related.concat(dataSource.data)
          } else {
            relData.related = assign(relData.related || {}, related)
          }
        } else {
          carve(relativeId, related, relData)
        }
      })
    }

    return relData
  }

  get relatedDatasources () {
    return this.related.data_sources || []
  }

  get type () {
    if (this.frontmatter.type) {
      return this.frontmatter.type
    }

    let relativePath = this.paths.relative
    if (relativePath.match('/')) { return singularize(relativePath.split('/')[0]) }
  }

  get groupName () {
    if (this.frontmatter.group) {
      return this.frontmatter.group
    }

    let relativePath = this.paths.relative
    if (relativePath.match('/')) { return pluralize(relativePath.split('/')[0]) }
  }


  get frontmatter () {
    let nodes = (this.parsed && this.parsed.children) || []

    if (nodes[0] && nodes[0].yaml) {
      return nodes[0].yaml
    }

    return { }
  }

  get lines () {
    return this.raw.split('\n')
  }

  get nodes () {
    return query_interface.nodes(this)
  }

  get headings () {
    return query_interface.headings(this)
  }

  get code () {
    return query_interface.code(this)
  }

  get mainCopy () {
     return this.selector('main > p').text()
  }
}

Document.GLOB = GLOB
Document.EXTENSIONS = EXTENSIONS

exports = module.exports = Document
