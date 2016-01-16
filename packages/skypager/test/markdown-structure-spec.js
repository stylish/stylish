describe("Markdown Structure Analysis", ()=>{
  let project = require('./fixture')

  let structured = project.documents.at('testcases/structure-spec')

  it("provides info about the different headings",()=>{
    structured.headings.sections.should.not.be.empty()
    structured.headings.articles.should.not.be.empty()
  })

  it("can traverse the hierarchy",()=>{
    structured.headings.section('Specifications').articles.should.not.be.empty()
  })
})
