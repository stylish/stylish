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

export function loadProjectFromDirectory (directory, skypagerProject) {
  var exists = require('path-exists')
  var path = require('path')

  try {
    skypagerProject = skypagerProject || ($skypager && $skypager['skypager-project'] && require($skypager['skypager-project']))
    skypagerProject = skypagerProject ||  require('skypager-project')
  } catch(error) {
    console.log('There was an error attempting to load the ' + 'skypager-project'.magenta + ' package.')
    console.log('Usually this means it is not installed or can not be found relative to the current directory')
    console.log()
    console.log('The exact error message we received is: '.yellow)
    console.log(error.message)
    console.log('stack trace: '.yellow)
    console.log(error.stack)
    process.exit(1)
    return
  }

	var manifest = loadManifestFromDirectory(directory)

  if (!manifest) {
    throw('Could not load project from ' + directory)
  }

	if (manifest.skypager && manifest.skypager.main) {
		return require(
			path.join(
				directory,
				manifest.skypager.main.replace(/^\.\//, '')
			)
		)
	}

  if (manifest.skypager) {
    return skypagerProject.load(
      join(directory,'package.json')
    )
  }

	if (exists(path.join(directory, 'skypager.js'))) {
		return require(
			path.join(directory, 'skypager.js')
		)
	}
}


export function loadManifestFromDirectory (directory) {
  return require('findup-sync')('package.json', {cwd: directory})
}

