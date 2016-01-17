//if (!process.env.SKYPAGER_DIST) { require('./environment')() }

import Collection from './collection'
import Registry from './registry'
import Project from './project'

import * as util from './util'
import * as Assets from './assets'
import * as Helpers from './helpers'

import { dirname, resolve, join, basename, extname } from 'path'

require('./polyfill')
require('should')

// temp
delete (Assets.default)
delete (Helpers.default)
delete (Project.default)

const ProjectCache = {
  projects: {  }
}

class Framework {
  constructor (root, initializer) {
    this.type = 'framework'
    this.root = __dirname

    util.hide.getter(this, 'manifest', () => assign(require(this.root + '/../package.json'), {root}))

    const plugins = [ ]

    this.registries = Registry.buildAll(this, Helpers, {root})

    util.hide.getter(this, 'enabledPlugins', () => plugins)

    if (typeof (initializer) === 'function') {
      initializer(this)
    }

    require('./environment')(this.root)
  }

  /**
  * Create a project loader for the specified path.
  * Returns a function you can execute when you want the project loaded.
  */
  create (pathToProject, options = {}) {
    let skypager = this

    return function(opts = {}) {
      return new skypager.load(pathToProject, Object.assign(options, opts))
    }
  }

  /**
  * Load a project in the specified path immediately.
  *
  */
  load (projectFile, options = {}) {
    let skypager = this

    if (ProjectCache.projects[projectFile]) {
       return ProjectCache.projects[projectFile]
    }

    let root = projectFile.match(/.js/i) ? dirname(projectFile) : projectFile

    options.manifest = options.manifest || {}
    options.manifest.skypager = options.manifest.skypager || {}

    // get the project manifest, which should include a skypager key
    try { Object.assign(options.manifest, require(root + '/package.json')) } catch (error) { }

    // allow for skypager.json files
    try { Object.assign(options.manifest.skypager, require(root + '/skypager.json')) } catch (error) { }

    if (process.env.SKYPAGER_DEBUG) {
      console.log('Loading skypager project file', projectFile, options)
    }

    let project = (new this.Project(projectFile, options))

    return ProjectCache.projects[projectFile] = project
  }

  use (...plugins) {
    this.enabledPlugins.concat(plugins.map(plugin => {
      let pluginConfig = this.plugins.lookup(plugin)
      pluginConfig.modify(this, pluginConfig)
    }))
  }

  get additionalPluginConfig () {

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

  get models () {
    return this.registries.models
  }

  get plugins () {
    return this.registries.plugins
  }

  get renderers () {
    return this.registries.renderers
  }

  get util () {
    return util
  }
}

module.exports = Framework
