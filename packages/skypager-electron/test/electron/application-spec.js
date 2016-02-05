import {enter} from '../../src/boot'
import Application from '../../src/application'

describe("The Skypager Electron Application", () => {
  it("should have an entry point for a CLI", () => {
    enter.should.be.a.Function()
  })

  it("should return an application instance", () => {
    let project = require('../../skypager.js')

    let app = new Application(project, { })

    app.should.have.property('state')
  })
})
