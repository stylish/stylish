describe("Model Definition DSL", ()=>{
  let project = require('./fixture')
  let model = project.models.lookup('testcase')
  let testcase = project.documents.at('testcases/structure-spec')
  
  describe( "Document -> Model Assignment", () => {
    it( "should know what kind of model it is", () => {
      testcase.should.have.property('modelClass')
    })

  })

  describe( "The Definition", () => { 
    let definition = model.definition

    it( "lets model authors describe the document", () => {
      definition.should.have.property('sectionsConfig')
    })

    it( "describes the configuration for sections", () => {
      definition.sectionsConfig.should.have.property('specifications')
      definition.sectionsConfig.specifications.should.have.property('builderType', 'builder')
    })

    it( "describes the configuration for a sections articles", () => {
      let section = definition.sectionsConfig.specifications
      section.config.articles.should.have.property('examples')
      section.config.articles.examples.should.have.property('builder')
      section.config.articles.examples.should.have.property('builderType','map')
    })

    it( "should give the model config", () => {
      model.config.should.have.property('attributes')
      model.config.should.have.property('documents')
      model.definition.config.documents.should.have.property('sections')
    })

    it( "should have an api", () => {
      model.should.have.property('api')
    })
  })
  
  describe( "The Content Interface", () => {
    it( "creates section objects for h2 headings", () => {
      let content = testcase.content

      content.should.have.property('specifications')
      content.specifications.should.be.an.Object()
    })

    it( "creates lists of articles for nested h3 headings", () => {
      let content = testcase.content
      let specifications = content.specifications
      
      specifications.should.have.property('examples')
      specifications.examples.should.be.an.Array()
    })
  })
})
