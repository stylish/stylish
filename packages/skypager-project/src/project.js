import Skypager from './index'

import Registry from './registry'
import Collection from './collection'
import resolver from './resolver'

import * as Helpers from './helpers'
import * as Assets from './assets'
import * as util from './util'
import logger from './logger'
import vault from './vault'
import invariant from 'invariant'

import pathExists from 'path-exists'

import { resolve, dirname, join, basename, extname } from 'path'

import mapValues from 'lodash/mapValues'
import defaults from 'lodash/defaultsDeep'
import pick from 'lodash/pick'

export class Project {
  /**
  * Load a Skypager Project from a folder. defaults to process.env.PWD
  *
  * @param {String}   uri                 absolute path to a folder or skypager.js file
  * @param {Object}   options             options for loading the project
  * @param {String}   options.type        an optional type identifier for the project
  * @param {Array}    options.plugins     an array of plugin names, or functions to enable
  * @param {Object}   options.manifest    the package.json manifest data
  * @param {Object}   options.autoLoad    an object specifying which content collections should be autoImported
  * @param {Object}   options.hooks       an object with functions that will respond to life cycle hooks whenever emitted
  * @param {Boolean}  options.autoImport  false to disable autoloading altogether
  *
  * @return {Project}
  */
  static load(uri = process.env.PWD, options = {}) {
    return Skypager.load(uri, options)
  }

  /**
  *
  * @private
  *
  * Wrap a project folder.
  *
  * A Project folder SHOULD contain a package.json with a `skypager` property
  * that contains an object.
  *
  * The `skypager` object on the manifest should contain:
  *
  * - main {String} a file that will get required and export the project.
  *
  * - plugins {Array} an array of the names of plugin packages.
  *   will try to use skypager-plugin-*
  *
  * - provides {Array} an optional list tags for what the project contains
  *     (e.g. ui:components, devtools, themes, website)
  *
  */
  constructor (uri, options = {}) {
    invariant(uri, 'uri must be provided')

    normalizeOptions(options)

    let project = this
    let hide = project.hidden.bind(project)
    let lazy = project.lazy.bind(project)
    let emit = project.emit.bind(project)

    hide('uri', uri)
    hide('type', options.type)

    project.root = uri.match(/\.(js|json)$/)
      ? dirname(uri)
      : uri

    project.name = options.name || basename(project.root)
    project.env = options.env

    hide('options', () => options)
    hide('manifest', options.manifest || {})

    // autobind hooks functions passed in as options
    hide('hooks', setupHooks.call(project, options.hooks))
    hide('paths', paths.bind(project))

    logger(project, options)

    hide('registries', registries.call(project), false)
    hide('_run', buildRunInterface.call(project), false)

    hide('enabledPlugins', [])

    if (options.plugins) {
      options.plugins.forEach(plugin => {
        if (typeof(plugin) === 'function') {
          plugin.call(this, this)
        } else {
          this.use(plugin)
        }
      })
    }

    hide('content', content.call(project))

    if (options.autoImport !== false && options.autoLoad !== false) {
      runImporter.call(project, options.importer)
    }

    lazy('entities', () => {
      emit('willBuildEntities')
      project.entities = entities.call(project)
      emit('didBuildEntities', project, project.entities)

      return project.entities
    })

    hide('modelDefinitions', modelDefinitions.bind(this))
  }

  /**
  * Combine all of the project settings files into a single structure.
  *
  * The values for a projects settings will be specific to process.env.NODE_ENV
  * if the settings file contains keys that match development, production, test etc.
  *
  * @return {Object}
  */
  get settings () {
    return this.content.settings_files.query((s) => true).condense({
      key: 'idpath',
      prop: 'data'
    })
  }

  /**
  * Combine all of the project copy files into a single structure.
  *
  * Copy values will be specific to the current locale setting for a project.
  *
  * @return {Object}
  */
  get copy () {
    return this.content.copy_files.query((s) => true).condense({
      key: 'idpath',
      prop: 'data'
    })
  }

  /**
  * Returns the current locale for the project. This value gets used
  * when building the copy system
  */
  get locale() {
    return this.get('settings.app.locale') || 'en'
  }

  /**
  * Trigger a project lifecycle hook.
  *
  * @param {String} name the name of the life cycle hook
  */
  emit(name, ...args) {
    let project = this
    let fn = project.hooks[name] || project[name]
    if (typeof fn === 'function') { fn.call(project, ...args) }
  }

  /**
  * Get an arbitrary value from the project using the lodash result utility.
  *
  * @example
  *
  *   project.get('docs.all[0].paths.absolute')
  */
  get (...args) {
    return util.result(this, ...args)
  }

  /**
  * Returns an instance of the project's vaule. This is a data store which
  * can be used to store keys and credentials that should not be exposed to the
  * outside, via an exporter, when publishing the project, etc.
  */
  get vault() {
    return vault(this)
  }

  /**
  * Provides a nicer language like interface around looking up and running
  * one of the project's helpers (e.g. actions, exporters, importers, etc.)
  *
  * @example
  *
  *   project.run.importer('disk')
  *   project.run.action('snapshots/save', '/path/to/snapshot.json')
  *
  */
  get run() {
    return this._run
  }

  /**
  * Find a single object in the project using the query mechanism.
  * Accepts any argument that project.query accepts.
  *
  * @param {String} source where to start the search.
  *   Any content collection or model name is valid.
  *
  * @param {Object, Function} params either attributes to match, or a predicate function
  */
  findBy(source, params) {
    params.limit = 1
    return this.query(source, params)[0]
  }

  get querySources() {
    return Object.keys(this.content)
      .concat(
        Object.keys(this.entities || {})
      ).concat([
        'docs', 'data', 'datasources'
      ])
  }

  query (source, params) {
    source = `${ source }`.toLowerCase()

    invariant(
       this.querySources.indexOf(source) >= 0,
       'Must supply a valid source to query from: ' + this.querySources.join(', ')
    )

    if (source === 'docs' || source === 'documents') {
      return this.docs.query(params)
    }

    if (source === 'data' || source === 'datasources' || source === 'data_sources') {
      return this.content.data_sources.query(params)
    }

    if (this.content[source]) {
      return this.content[source].query(params)
    }

    if (this.modelGroups.indexOf(source) > 0) {
      return util.filterQuery(
        util.values(this.entities[source]),
        params
      )
    }
  }

  /**
  * Run a query against the project helper registries.
  *
  * @param {String} source which registry to run your query against
  * @param {Object, Function} params the search criteria
  *
  * @return {Helper}
  */
  queryHelpers(source, params) {
     return this.registries[source].query(params)
  }

  /**
  * Returns a manifest of all of the project's assets.
  */
  get assetManifest () {
    return this.exporters.run('assets', {
      project: this
    })
  }

  /**
   * Returns an array of all of this project's content collections.
   */
  get collections() {
    return util.values(this.content)
  }

  /**
  * Returns an array of every asset in the project
  *
  * @return {Array}
  */
  get allAssets () {
    return util.flatten(this.collections.map(c => c.all))
  }

  /**
  * Returns an array of relative paths for every asset in the project.
  *
  * @return {Array}
  */
  get assetPaths (){
    return this.allAssets.map(a => a.paths.project)
  }

  /**
  * Iterate over every asset in the project.
  */
  eachAsset (...args) {
     return this.allAssets.forEach(...args)
  }

  /**
  * Run a reducer function against every asset in the project.
  *
  */
  reduceAssets(...args) {
     return this.allAssets.reduce(...args)
  }

  /**
  * Convenience method for running Array.map for every asset.
  */
  mapAssets(...args) {
     return this.allAssets.map(...args)
  }

  /**
  * Convenience method for running Array.filter for every asset in the project.
  */
  filterAssets(...args) {
     return this.allAssets.filter(...args)
  }

  /**
  * Access a document by the document id short hand
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
  use (plugins, options = {}) {
    if (typeof plugins === 'string') {
      plugins = [plugins]
    }

    plugins.forEach(plugin => {
      let pluginConfig = this.plugins.lookup(plugin)

      if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
        options.project = options.project || this
        pluginConfig.api.modify(options)
      } else {
        if (typeof pluginConfig.api === 'function') {
          pluginConfig.api.call(this, this, pluginConfig)
        }
      }

      this.enabledPlugins.push(plugin)
    })
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

  join(...args) {
    return this.paths.join(...args)
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

  get data () {
    return this.content.data_sources
  }

  get images () {
    return this.content.images
  }

  get packages () {
    return this.content.packages
  }

  get projects () {
    return this.content.projects
  }

  get scripts () {
    return this.content.scripts
  }

  get stylesheets () {
    return this.content.stylesheets
  }

  get stylesheets () {
    return this.content.stylesheets
  }

  get vectors () {
    return this.content.vectors
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

  get modelGroups () {
    return this.models.all.map(model =>
      util.tabelize(util.underscore(model.name))
    )
  }

  streamFile(path, type = 'readable', mode) {
    let fd = require('fs').openSync(path, 'a+')
    let stream

    if ( type.match(/read/) ) {
      try {
        stream = require('fs').createReadStream(path, {fd})
      } catch(error) {
         console.log(error.message, 'readable')
      }
    } else if (type.match(/write/)) {
      try {
        stream = require('fs').createWriteStream(path, {fd})
      } catch(error) {
         console.log(error.message, 'writeable')
      }
    } else {
      // TODO: How to do bidirectional?
    }

    return stream
  }

  exists(...args) {
    try {
      return pathExists.sync(
        this.path(...args)
      )
    } catch(error) {
       return false
    }
  }

  ensureFolder(...pathArgs) {
    let fs = require('fs')
    let path = this.path(...pathArgs)

    return new Promise((resolve,reject) => {
      if (this.exists(path)) { resolve(path); return path }

      require('fs').mkdir(path, (err) => {
        if(err) { reject(err); return false }
        resolve(path)
      })
    })
  }

  ensurePath(...args) {
    let name = args[0]
    if(this.paths[name]) { return this.ensureFolder(...args) }
  }
}

export default Project

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
    packages: join(this.root, 'packages'),
    plugins: join(this.root, 'plugins'),
    projects: join(this.root, 'projects'),
    renderers: join(this.root, 'renderers'),
    vectors: join(this.root, 'assets'),
    images: join(this.root, 'assets'),
    scripts: join(this.root, 'src'),
    stylesheets: join(this.root, 'src'),
    manifest: join(this.root, 'package.json'),
    tmpdir: join(this.root, 'tmp'),
    temp: join(this.root, 'tmp'),
    cache: join(this.root, 'tmp', 'cache'),
    logs: join(this.root, 'log'),
    build: join(this.root, 'dist'),
    public: join(this.root, 'public'),
    settings: join(this.root, 'settings'),
    copy: join(this.root, 'copy'),
    join: function (...args) {
      return join(project.root, ...args)
    }
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
  let { autoLoad, type } = options

  project.logger.profile('import starting')

  let result = project.importers.run(type || 'disk', {
    project: this,
    collections: this.content,
    autoLoad
  })

  project.logger.profile('import finishing')

  return result
}

function buildContentCollectionsManually () {
  const project = this
  const paths = project.paths

  let {
    Asset, DataSource, Document,
    CopyFile, Image, Script, Stylesheet,
    ProjectManifest, SettingsFile, Vector
  } = Assets

  return {
    assets: Asset.createCollection(this, {root: this.paths.assets}),
    data_sources: DataSource.createCollection(this, {root: this.paths.data_sources}),
    documents: Document.createCollection(this, {root: this.paths.documents}),
    images: Image.createCollection(this, {root: this.paths.images}),
    scripts: Script.createCollection(this, {root: this.paths.scripts}),
    stylesheets: Stylesheet.createCollection(this, {root: this.paths.stylesheets}),
    vectors: Vector.createCollection(this, {root: this.paths.vectors}),

    packages: new Collection({
      root: this.paths.packages,
      project: this,
      assetClass: ProjectManifest,
      include: '*/package.json',
      exclude: '**/node_modules'
    }),

    projects: new Collection({
      root: this.paths.projects,
      project: this,
      assetClass: ProjectManifest,
      include: '*/package.json',
      exclude: '**/node_modules'
    }),

    copy_files: new Collection({
      root: this.paths.copy,
      project: this,
      assetClass: CopyFile
    }),

    settings_files: new Collection({
      root: this.paths.settings,
      project: this,
      assetClass: SettingsFile
    })
  }
}

function stores () {
  let project = this
}

function registries () {
  let project = this
  let root = project.root

  let registries = Registry.buildAll(project, Helpers, {root})

  project.emit('registriesDidLoad', registries)

  return registries
}

function modelDefinitions() {
  return this.models.available.reduce((memo,id) => {
    let model = this.models.lookup(id)

    Object.assign(memo, {
      get [util.tabelize(util.underscore(model.name))](){
        return model.definition
      }
    })

    return memo
  }, {})
}

function entities() {
  return this.models.available.reduce((memo,id) => {
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

function setupHooks(hooks = {}) {
  let project = this

  return Object.keys(hooks).reduce((memo, hook) => {
    let fn = hooks[hook]

    if (typeof fn === 'function') {
      memo[hook] = fn.bind(project)
    }

    return memo
  }, {})
}

function normalizeOptions (options = {}) {
  if (options.manifest && options.manifest.skypager) {
    options = Object.assign(options, options.manifest.skypager)
  }

  return defaults(options, DefaultOptions)
}

function buildRunInterface() {
     let project = this

    return {
      action (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.actions.run(helperId, options, context)
      },

      importer (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.importers.run(helperId, options, context)
      },

      exporter (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.exporters.run(helperId, options, context)
      },

      plugin (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.plugins.run(helperId, options, context)
      },

      model (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.models.run(helperId, options, context)
      },

      renderer (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.renderers.run(helperId, options, context)
      },

      view (helperId, options = {}, context = {}) {
        context.project = context.project || options.project || project
        return project.views.run(helperId, options, context)
      }
    }

}

const HOOKS = [
  'contentWillInitialize',
  'contentDidInitialize',
  'projectWillAutoImport',
  'projectDidAutoImport',
  'willBuildEntities',
  'didBuildEntities',
  'registriesDidLoad'
]

const DefaultOptions = {
  type: 'project',
  env: process.env.NODE_ENV || 'development',
  importer: {
    type: 'disk',
    autoLoad: {
      documents: true,
      data_sources: true,
      settings_files: true,
      copy_files: true
    }
  }
}


