describe("Markdown Structure Analysis", function(){
  let project = require('./fixture')

  let structured = project.documents.at('testcases/structure-spec')

  it("provides info about the different headings",function(){
    structured.headings.sections.should.not.be.empty()
    structured.headings.articles.should.not.be.empty()
  })

  it("can traverse the hierarchy",function(){
    structured.headings.section('Specifications').articles.should.not.be.empty()
  })
})
