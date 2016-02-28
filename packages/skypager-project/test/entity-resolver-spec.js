describe("Resolving Entities",function(){
  let project = require('./fixture')

  describe('Any Asset -> Model Resolution', function(){
    it('can resolve script assets to models', function(){
      let layout = project.scripts.at('layouts/ExampleLayout')
      layout.modelClass.name.should.equal('Layout')
    })

    it('can use the settings yml to pick up resolver config', function(){
      let entry = project.scripts.at('entries/entryPoint')
      entry.should.have.property('modelClass')
      entry.modelClass.name.should.equal('Entry Point')
    })
  })

  describe('Document -> Model Resolution', function(){
    it("resolves documents to model types", function(){
      let doc = project.documents.at('testcases/structure-spec')
      project.resolve.model(doc).name.should.equal('Testcase')
      project.resolve.model(doc).name.should.equal(doc.modelClass.name)
      project.resolve.model(doc).should.equal(doc.modelClass)
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
})
