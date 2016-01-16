import Skypager from './index'

describe("The Plugin System", ()=>{
  let project = require('./fixture')
  
  it("knows which plugins are available",()=>{
    Skypager.plugins.available.length.should.equal(2)
  })
  
  it("shows available project plugins", ()=>{
    project.plugins.available.should.containEql('test_runner')
  })
  
  it("loads the projects models", ()=>{
    project.use("test_runner")
    project.models.lookup("example_plugin_model").should.have.property('definition')
  })
})
