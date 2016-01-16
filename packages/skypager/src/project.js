import Skypager from './index'
import md5 from 'md5'

import Registry from './registry'
import Collection from './collection'
import resolver from './resolver'

import * as Helpers from './helpers'
import * as Assets from './assets'
import * as util from './util'

import { resolve, dirname, join, basename, extname } from 'path'

import _debug from 'debug'

const debug = _debug('skypager:project')
const hide = util.hide.getter
const lazy = util.lazy

class Project {
  constructor (uri, options = {}) {
    debug('project created at: ' + uri)
    debug('Option keys: ' + Object.keys(options))

    uri.should.be.a.String()
    uri.should.not.be.empty()

    let project = this

    project.uri = uri
    project.root = dirname(uri)
    project.type = options.type || 'project'

    project.hidden('options', () => options)

    Object.defineProperty(project, 'manifest', {
      enumerable: false,
      value: options.manifest || {}
    })

    project.hidden('paths', paths.bind(project))
    project.lazy('registries', registries.bind(project), false)

    project.name = options.name || basename(project.root)

    // wrap the content interface in a getter but make sure
    // the documents collection is loaded and available right away
    project.hidden('content', content.call(project))

    if (options.autoImport !== false) {
      debug('running autoimport', options.autoLoad)

      runImporter.call(project, {
        autoLoad: options.autoLoad || {
          documents: true,
          assets: true,
          vectors: true
        }
      })
    }

    const plugins = [ ]

    util.hide.getter(project, 'enabledPlugins', () => plugins)
    util.hide.getter(project, 'supportedAssetExtensions', () => Assets.Asset.SupportedExtensions )

    Object.defineProperty(project, 'entities', {
      configurable: true,
      get: function () {
        delete project.entities
        debug('building entities')
        return project.entities = entities.call(project)
      }
    })
  }

  /**
   * A proxy object that lets you run one of the project helpers.
   *
   * @example
   *
   * project.run.importer('disk')
   * project.run.action('snapshots/save', '/path/to/snapshot.json')
   *
   */
  get run(){
    let project = this

    return {
      action: function action(...args) { return project.actions.run(...args) },
      context: function context(...args) { return project.contexts.run(...args) },
      importer: function importer(type, ...args) { return project.importers.run((type || project.options.importer || 'disk'), ...args) },
      exporter: function exporter(type, ...args) { return project.exporters.run((type || project.options.exporter || 'snapshot'), ...args) },
      model: function model(...args) { return project.models.run(...args) },
      renderer: function renderer(...args) { return project.renderers.run(...args) },
      view: function view(...args) { return project.views.run(...args) }
    }
  }

  get assetManifest () {
    return this.exporters.run('asset_manifest', {
      project: this
    })
  }


  /**
   * Returns an array of all of this project's content collections.
   */
  get collections() {
    return util.values(this.content)
  }

  get allAssets () {
    return util.flatten(this.collections.map(c => c.all))
  }

  get assetPaths (){
    return this.allAssets.map(a => a.paths.project)
  }

  /**
  * Access a document by the document id short hand
  *
  * Documents are the most important part of a Skypager project, so make it easy to access them
  *
  */
   at (documentId) {
     return this.documents.at(documentId)
   }

  /**
  * This is a system for resolving paths in the project tree to the
  * appropriate helper, or resolving paths to the links to these paths
  * in some other system (like a web site)
  */
  get resolve () {
    return this.resolver
  }

  /**
  * @alias Project#resolve
  */
  get resolver () {
    return resolver.call(this)
  }

  /**
  * Use a plugin from the plugins registry
  *
  */
  use (...plugins) {
    this.enabledPlugins.concat(plugins.map(plugin => {
      let pluginConfig = this.plugins.lookup(plugin)

      if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
        pluginConfig.api.modify(this)
      } else {
        if (typeof pluginConfig.api === 'function') {
          pluginConfig.api.call(this, this, pluginConfig)
        }
      }

      return plugin
    }))
  }

  /*
  * Aliases to create hidden and lazy getters on the project
  */
  hidden (...args) { return util.hidden.getter(this, ...args) }
  lazy (...args) { return util.lazy(this, ...args) }

  /**
   * build a path from a base (e.g. documents, models, build)
   * using path.join
   */
  path (base, ...rest) {
    return join(this.paths[base], ...rest)
  }

  /**
  * Collection Accessor Methods
  *
  * These can be used to access document collections within the project
  */
  get docs () {
    return this.documents
  }

  get documents () {
    return this.content.documents
  }

  get data_sources () {
    return this.content.data_sources
  }

  get data_sources () {
    return this.content.data_sources
  }

  get collections () {
    return util.values(this.content)
  }

  get actions () {
    return this.registries.actions
  }

  get contexts () {
    return this.registries.contexts
  }

  get exporters () {
    return this.registries.exporters
  }

  get importers () {
    return this.registries.importers
  }

  get plugins () {
    return this.registries.plugins
  }

  get models () {
    return this.registries.models
  }

  get stores () {
    return this.registries.stores
  }

  get renderers () {
    return this.registries.renderers
  }

  get views () {
    return this.registries.views
  }
}

module.exports = Project

function paths () {
  let project = this

  let conventional = {
    assets: join(this.root, 'assets'),
    actions: join(this.root, 'actions'),
    contexts: join(this.root, 'contexts'),
    data_sources: join(this.root, 'data'),
    documents: join(this.root, 'docs'),
    exporters: join(this.root, 'exporters'),
    importers: join(this.root, 'importers'),
    models: join(this.root, 'models'),
    plugins: join(this.root, 'plugins'),
    renderers: join(this.root, 'renderers'),
    vectors: join(this.root, 'assets'),
    images: join(this.root, 'assets'),
    scripts: join(this.root, 'assets'),
    stylesheets: join(this.root, 'assets'),
    manifest: join(this.root, 'package.json'),
    cache: join(this.root, 'tmp', 'cache'),
    logs: join(this.root, 'log'),
    build: join(this.root, 'dist')
  }

  let custom = project.options.paths || project.manifest.paths || {}

  return util.assign(conventional, custom)
}

function content () {
  let project = this
  let collections = buildContentCollectionsManually.call(project)

  return collections
}

function runImporter (options = {}) {
  let project = this
  let collections = project.collections
  let { autoLoad, importer } = options

  debug('import starting')
  let result = project.importers.run(importer || 'disk', { project: this, collections: this.content, autoLoad })
  debug('import finishing')

  return result
}

function buildContentCollectionsManually () {
  const project = this
  const paths = project.paths

  let { Asset, DataSource, Document, Image, Script, Stylesheet, Vector } = Assets

  return {
    assets: Asset.createCollection(this, false),
    data_sources: DataSource.createCollection(this, false),
    documents: Document.createCollection(this, false),
    images: Image.createCollection(this, false),
    scripts: Script.createCollection(this, false),
    stylesheets: Stylesheet.createCollection(this, false),
    vectors: Vector.createCollection(this, false)
  }
}

function stores () {
  let project = this
}

function registries () {
  let project = this
  let root = project.root

  return Registry.buildAll(project, Helpers, {root})
}

function entities() {
  let modelNames = ['outline','page'].concat(this.models.available)

  return modelNames.reduce((memo,id) => {
    let model = this.models.lookup(id)
    let entities = model.entities = model.entities || {}

    Object.assign(memo, {
      get [util.tabelize(util.underscore(model.name))](){
        return entities
      }
    })

    return memo
  }, {})
}
