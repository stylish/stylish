//if (!process.env.SKYPAGER_DIST) { require('./environment')() }

import Collection from './collection'
import Registry from './registry'
import Project from './project'

import * as util from './util'
import * as Assets from './assets'
import * as Helpers from './helpers'

import { dirname, resolve, join, basename, extname } from 'path'

import defaults from 'lodash/defaultsDeep'

require('./polyfill')
GLOBAL.invariant = require('invariant')

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


    util.hide.getter(this, 'manifest', require('../package.json'))

    const plugins = [ ]

    this.registries = Registry.buildAll(this, Helpers, {root})

    util.hide.getter(this, 'enabledPlugins', () => plugins)

    try {
      var projectManifest

      try {
        projectManifest = require(join(process.env.PWD, 'package.json'))
      } catch(e2) {  }

      if (projectManifest && projectManifest.skypager && projectManifest.skypager.plugins) {
        eagerLoadProjectPlugins(this, projectManifest.skypager.plugins)
      }
    } catch(e) {
      console.log('Tried to eager load project plugins and failed', projectManifest.skypager.plugins)
    }

    if (typeof (initializer) === 'function') {
      initializer(this)
    }

    //require('./environment')(this.root)

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
  load (projectFile = process.env.PWD, options = {}) {
    let skypager = this

    if (typeof projectFile === 'object') {
      if (isEmpty(options)) {
        options = projectFile
      }

      projectFile = options.root || process.env.PWD
    }

    if (ProjectCache.projects[projectFile]) {
       return ProjectCache.projects[projectFile]
    }

    let root = projectFile

    if(projectFile.match(/\.(js|json)$/i)) {
      root = dirname(projectFile)
    }

    if (!options.manifest) {
      try {
        options.manifest = require( join(root, 'package.json'))
      } catch(error) {
        console.log('Error loading manifest', error.message, join(root,'package.json'))
      }
    }

    defaults(options, {
      manifest: {
        skypager: {
          plugins:[]
        }
      }
    })

    let project = (new this.Project(projectFile, options))

    return ProjectCache.projects[projectFile] = project
  }

  use (plugins, options = {}) {
    if (typeof plugins === 'string') {
      plugins = [plugins]
    }

    plugins.forEach(plugin => {
      let pluginConfig = this.plugins.lookup(plugin)

      if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
        pluginConfig.api.modify(this)
      } else {
        if (typeof pluginConfig.api === 'function') {
          pluginConfig.api.call(this, this, pluginConfig)
        }
      }

      this.enabledPlugins.push(plugin)
    })
  }

  loadPlugin(request) {
    let loader

    if (typeof request === 'string') {
      try {
        loader = require(request)
      } catch (e) {
        console.log(`Error loading plugin at ${ request }: ${ e.message }`)

        try {
          loader = require(`skypager-plugin-${ request }`)
        } catch(e2) {
          console.log(`Retried using skypager-plugin-${ request }: ${ e2.message }`)
        }
      }

      if (loader) { request = loader }
    }

    this.plugins.runLoader(request)
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

function eagerLoadProjectPlugins(skypager, list) {
  list
  .filter(item => item && (typeof item === 'string'))
  .filter(item => !item.match(/skypager-plugin-/))
  .forEach(plugin => {
    try {
      skypager.loadPlugin(require(`skypager-plugin-${ plugin }`))
    } catch(error) {

    }
  })
}
module.exports = Framework
