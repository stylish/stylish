describe("Resolving Entities",function(){
  let project = require('./fixture')

  it("resolves documents to model types", function(){
    let doc = project.documents.at('testcases/structure-spec')
    project.resolve.model(doc).name.should.equal('Testcase')
  })

  it("can use the type metadata to determine model type",function(){
    let doc = project.documents.at('index')
    project.resolve.model(doc).name.should.equal('Testcase')
  })

  it("accepts arguments in the project export for resolver patterns", function(){
    project.resolve.patterns.models.should.not.be.empty()
  })

  it("uses the resolver patterns to match a document uri", function(){
    let doc = project.documents.at("helpers/action-spec")
    project.resolve.model(doc.uri).name.should.equal('Testcase')
  })

  it("resolves a document to a model", function(){
    let doc = project.documents.at("helpers/action-spec")
    project.resolve.model(doc).name.should.equal('Testcase')
  })
})
