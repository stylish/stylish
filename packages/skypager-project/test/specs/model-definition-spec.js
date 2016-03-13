describe("Model Definition DSL", function(){
  let project = require('../fixture')
  let model = project.models.lookup('testcase')
  let testcase = project.documents.at('testcases/structure-spec')

  describe( "Document -> Model Relationship", function(){
    it( "should know what kind of model it is", function(){
      testcase.should.have.property('modelClass')
    })

    it( "should get decorated", function(){
      //testcase.should.have.property('decoratedGetter', 'decoratedGetter')
      //testcase.should.have.property('decoratedMethod')
    })

    it( "should recognize the decorated methods as actions", function(){
      testcase.modelClass.actions.should.contain('testcases/run')
    })
  })

  describe( "The Definition", function(){
    let definition = model.definition

    it( "lets model authors describe the document", function(){
      definition.should.have.property('sectionsConfig')
    })

    it( "describes the configuration for sections", function(){
      definition.sectionsConfig.should.have.property('specifications')
      definition.sectionsConfig.specifications.should.have.property('builderType', 'builder')
    })

    it( "describes the configuration for a sections articles", function(){
      let section = definition.sectionsConfig.specifications
      section.config.articles.should.have.property('examples')
      section.config.articles.examples.should.have.property('builder')
      section.config.articles.examples.should.have.property('builderType','map')
    })

    it( "should give the model config", function(){
      model.config.should.have.property('attributes')
      model.config.should.have.property('documents')
      model.definition.config.documents.should.have.property('sections')
    })

    it( "should have an api", function(){
      model.should.have.property('api')
    })
  })

  describe( "The Content Interface", function(){
    it( "creates section objects for h2 headings", function(){
      let content = testcase.content

      content.should.have.property('specifications')
      content.specifications.should.be.an('object')
    })

    it( "creates lists of articles for nested h3 headings", function(){
      let content = testcase.content
      let specifications = content.specifications

      specifications.should.have.property('examples')
      specifications.examples.should.be.an('array')
    })
  })
})
