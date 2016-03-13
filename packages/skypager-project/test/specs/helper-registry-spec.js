describe("Skypager.Registry", function(){
  let project = require('../fixture')

  it("provides access to framework and project models", function(){
    project.models.lookup("outline").should.be.a.Function
    project.models.lookup("testcase").should.be.a.Function
  })

  it("provides access to framework and project plugins", function(){
    project.plugins.lookup("test_runner").should.be.a.Function
  })
})

describe("Project Registry", function(){
  let project = require('../fixture')
  let testcase = project.models.lookup("testcase")

  before(function(){
    project.exporters.remove("sample")
  })

  it("required loading helpers manually if they dont have an index", function(){
    project.exporters.load(require.resolve('../fixture/exporters/sample'),'sample')
    project.exporters.available.should.contain('sample')
    project.exporters.remove("sample")
  })

  it("provides access to a model definition object if present", function(){
    testcase.should.have.property('definition')
  })

  it("makes any helper available in the context of the project", function(){
    project.importers.lookup('disk').should.have.property('project', project)
  })

  it("lets you run exporters in the context of the project", function(){
    project.exporters.load(require.resolve('../fixture/exporters/sample'),'sample')
    project.exporters.lookup("sample").api.should.be.a('function')
  })
})
