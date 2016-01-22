describe("Skypager.Registry", ()=>{
  let project = require('./fixture')

  it("provides access to framework and project models", ()=>{
    project.models.lookup("outline").should.be.a.Function
    project.models.lookup("testcase").should.be.a.Function
  })

  it("provides access to framework and project plugins", ()=>{
    project.plugins.lookup("test_runner").should.be.a.Function
  })
})

describe("Project Registry", ()=>{
  let project = require('./fixture')
  let testcase = project.models.lookup("testcase")

  before(function(){
    project.exporters.remove("sample")
  })

  it("required loading helpers manually if they dont have an index", ()=>{
    project.exporters.load(require.resolve('./fixture/exporters/sample'),'sample')
    project.exporters.available.should.containEql('sample')
    project.exporters.remove("sample")
  })

  it("provides access to a model definition object if present", ()=>{
    testcase.should.have.property('definition')
  })

  it("makes any helper available in the context of the project", () => {
    project.importers.lookup('disk').should.have.property('project', project)
  })

  it("lets you run exporters in the context of the project", ()=>{
    project.exporters.load(require.resolve('./fixture/exporters/sample'),'sample')
    project.exporters.lookup("sample").api.should.be.a.Function()
  })
})
