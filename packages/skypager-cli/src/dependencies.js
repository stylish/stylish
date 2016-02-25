import { findPackageSync } from './util'
import { join, dirname } from 'path'
import values from 'lodash/values'
import omit from 'lodash/values'
import camelCase from 'lodash/camelCase'
import transform from 'lodash/transform'

const requiredPackages = {
  'skypager-project': process.env.SKYPAGER_PROJECT_ROOT,
  'babel-preset-skypager': process.env.BABEL_PRESET_SKYPAGER_ROOT
}

const supportPackages = {
  'skypager-devpack': process.env.SKYPAGER_DEVPACK_ROOT,
  'skypager-electron': process.env.SKYPAGER_ELECTRON_ROOT,
  'skypager-server': process.env.SKYPAGER_SERVER_ROOT,
  'skypager-themes': process.env.SKYPAGER_THEMES_ROOT
}

const { keys } = Object

export function missingSupportPackages(){
  return keys(supportPackages).filter(key => typeof supportPackages[key] !== 'undefined')
}

export function missingRequiredPackages() {
  return keys(omit(requiredPackages,'skypager-cli')).filter(key => typeof requiredPackages[key] !== 'undefined')
}


export function checkAll() {
  keys(requiredPackages).forEach(packageName => {
    let dir = findPackageSync(packageName)

    if (dir) {
      requiredPackages[packageName] = requiredPackages[packageName] ||
        (requiredPackages[packageName] = process.env[toEnv(packageName)] = dir)
    }
  })

  keys(supportPackages).forEach(packageName => {
    let dir = findPackageSync(packageName)

    if (dir) {
      supportPackages[packageName] = supportPackages[packageName] ||
        (supportPackages[packageName] = process.env[toEnv(packageName)] = dir)
    }
  })

  return getPathsGlobal()
}

function toEnv(packageName) {
   return `${ packageName }-root`.toUpperCase().replace(/\-/g,'_')
}

export function getPaths() {
  let paths = Object.assign({}, requiredPackages, supportPackages)

  return transform(paths, (result, value, key) => {
    result[camelCase(key.replace(/skypager\-/g,''))] = value
  }, paths)
}

export function getPathsGlobal() {
   return global.$skypager = global.$skypager || getPaths()
}

