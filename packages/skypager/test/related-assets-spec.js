describe("Related Assets", ()=>{
  let project = require('./fixture')
  let subject = project.documents.at('assets/data-source-spec')

  it("relates assets across different content collections", ()=>{
    subject.related.data_sources.length.should.equal(2)
  })

  it("provides a related data summary", ()=>{
    subject.relatedData.should.have.property('nested')
    subject.relatedData.nested.should.have.property('data')
    subject.relatedData.nested.data.should.have.property('explanation')
    subject.relatedData.nested.data.explanation.length.should.not.equal(0)
  })
})
