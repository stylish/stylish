import fs from 'fs'
import path from 'path'
import findModules from 'find-node-modules'

const join = path.join

export function findPackageSync (packageName, root = process.env.PWD) {
  let moduleDirectories = findModules(root, {relative:false})

  let directory = moduleDirectories.find((p) => {
    let exists = pathExists(join(p, packageName))
    return exists
  })

  if (!directory) {
    try {
      let resolvedPath = path.dirname(require.resolve(packageName))
      return resolvedPath
    } catch(error) {
      console.log('Error looking up package', packageName, error.message)
    }
  }

  return directory && path.resolve( path.join(directory, packageName))
}

export function findPackage (packageName, options = {}) {
  return new Promise((resolve, reject) => {
    let moduleDirectories = findModules(process.env.PWD, {relative:false})
    let directory = moduleDirectories.find((p) => {
      let exists = pathExists(join(p, packageName))
      return exists
    })

    if (!directory) {
      try {
        let resolvedPath = path.dirname(require.resolve(packageName))
        resolve(resolvedPath)
        return
      } catch(error) {

      }
    }

    if (!directory) { reject(packageName); }

    let result = path.resolve(path.join(directory, packageName))

    if(result) { resolve(result) }
  })
}

export function splitPath(p = '') {
   return path.resolve(p).split(path.sep)
}

export function skypagerBabel() {
  let presets = findPackageSync('babel-preset-skypager')

  try {
    presets ? require('babel-register')({presets}) : require('babel-register')
  } catch(error) {
    abort('Error loading the babel-register library. Do you have the babel-preset-skypager package?')
  }
}


export function pathExists(fp) {
	var fn = typeof fs.access === 'function' ? fs.accessSync : fs.statSync;

  try {
     fn(fp)
     return true
  } catch(error) {
    return false
  }
}

/**
 * Frameworks which extend from Skypager can use this to make sure
 * they have a chance to be the framework responsible for loading projects
 */
export function loadSkypagerFramework(id) {
  try {
    return (typeof $skypager !== 'undefined') && !id
      ? require($skypager.project || 'skypager-project')
      : require(id)

  } catch(error) {
    console.log('Error loading skypager framework module from the CLI. id ' + id)
    throw(error)
  }
}

export function loadProjectFromDirectory (directory, frameworkHost='skypager-project') {
  var exists = require('path-exists')
  var path = require('path')

  let skypagerFramework = typeof frameworkHost === 'string'
    ? loadSkypagerFramework(frameworkHost)
    : frameworkHost

	var manifest = loadManifestFromDirectory(directory) || {}
  var pathToMain = path.join(directory, 'skypager.js')

	if (manifest.skypager && manifest.skypager.main) {
	  pathToMain = path.join(directory, manifest.skypager.main.replace(/^\.\//, ''))

    if (!exists(pathToMain)) {
      console.log('The skypager.main value in the package manifest points to a non existing file'.red)
      console.log('Value: ' + manifest.skypager.main + ' Path: ' + pathToMain)
      throw('Invalid skypager package main')
    }
	}

	if (!exists(pathToMain) && manifest.skypager) {
    pathToMain = join(directory, 'package.json')
	}

  try {
    let projectExport = skypagerFramework.load(pathToMain)

    return typeof projectExport === 'function'
      ? projectExport.call(skypagerFramework)
      : projectExport

  } catch (error) {
    console.log('There was an ' + 'error'.red + ' loading the skypager project from: ' + pathToMain.yellow)
    console.log('Using the skypager framework:', skypagerFramework)
    throw(error)
  }
}


export function loadManifestFromDirectory (directory) {
  return require('findup-sync')('package.json', {cwd: directory})
}
