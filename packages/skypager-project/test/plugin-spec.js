import Skypager from './index'

describe("The Plugin System", function(){
  let project = require('./fixture')
  let called = false

  it("has an easy way of loading helpers into a project host", function(){
    let count = 0
    project.run.action('loader', () => { count = count + 1 })
    count.should.not.equal(0)
  })

  it("knows which plugins are available",function(){
    Skypager.plugins.available.length.should.not.equal(0)
  })

  it("makes framework plugins available to a project", function(){
    project.plugins.available.should.contain('example')
  })

  it("shows available project plugins", function(){
    project.plugins.available.should.contain('test_runner')
  })

  it("automatically loads plugins defined in the manifest", function(){
    project.enabledPlugins.should.contain('test_runner')
  })

  it("loads the projects models", function(){
    project.models.lookup("example_plugin_model").should.have.property('definition')
  })
})
