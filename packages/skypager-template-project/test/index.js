import { join } from 'path'

let e = {
  get skypager() {
    let skypager = require('../../skypager-project')

    // if you're testing plugins you can load them here
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
