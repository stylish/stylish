import Skypager from './index'

describe("The Plugin System", ()=>{
  let project = require('./fixture')
  let called = false

  it("has an easy way of loading helpers into a project host", () => {
    let count = 0
    project.run.action('loader', () => { count = count + 1 })
    count.should.not.equal(0)
  })

  it("knows which plugins are available",()=>{
    Skypager.plugins.available.length.should.not.equal(0)
  })

  it("makes framework plugins available to a project", () => {
    project.plugins.available.should.containEql('example')
  })

  it("shows available project plugins", ()=>{
    project.plugins.available.should.containEql('test_runner')
  })

  it("automatically loads plugins defined in the manifest", ()=>{
    project.enabledPlugins.should.containEql('test_runner')
  })

  it("loads the projects models", ()=>{
    project.models.lookup("example_plugin_model").should.have.property('definition')
  })
})
