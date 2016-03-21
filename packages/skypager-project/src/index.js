try {
  require('babel-polyfill')
} catch (e) { }

import Framework from './framework'
import Project from './project'
import Collection from './collection'
import Registry from './registry'
import Assets from './assets'
import Helpers from './helpers'

class Skypager extends Framework {
  get Project () { return Project }
  get Assets () { return Assets }
  get Helpers () { return Helpers }
  get Plugin () { return Helpers.Plugin }

  get util () {
    return util
  }
}

// this tries to ensure that only one instance of skypager lj
let framework = new Skypager(__dirname, 'skypager')

module.exports = framework
