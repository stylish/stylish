import fs from 'fs'
import path from 'path'
import findModules from 'find-node-modules'

const join = path.join

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
  findPackage('babel-preset-skypager').then(path => {
    require('babel-register')({
      presets:[
        require(path)
      ]
    })
  })
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
  var exists = require('fs').existsSync
  var path = require('path')

  skypagerProject = skypagerProject || require('skypager-project')

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

