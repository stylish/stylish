import { join } from 'path'

let e = {
  get skypager() {
    let plugin = require('../src/index')
    let skypager = require('../../skypager-project')

    skypager.loadPlugin(plugin)

    return skypager
  }
}

Object.assign(e, {
  get project() {
    let skypager = e.skypager
    return require('./fixture/skypager.js')(skypager)
  }
})

module.exports = e
