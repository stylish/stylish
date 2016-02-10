describe("Access Via Dot Paths", function(){
  let project = require('./fixture')
  let doc = project.docs.at('assets/data-source-spec')

  it("lets me access collection content via a dot path interface", function(){
    doc.should.have.property('idPath', 'assets.data_source_spec')
    project.docs.at.should.be.a.Function()
    project.docs.at.should.have.property('assets')
    project.docs.at.assets.should.have.property('data_source_spec')
    project.docs.at.assets.should.have.property('document_spec')
    project.docs.at.assets.data_source_spec.should.have.property('id', doc.id)
    project.docs.at.assets.document_spec.should.have.property('id', 'assets/document-spec')
  })

  it("lets me access registry helpers via a dot path interface", function(){
    project.actions.lookup('testcases/run').should.have.property('api')
    project.actions.lookup('testcases/random').should.have.property('api')

    project.actions.at.should.have.property('testcases')
    project.actions.at.testcases.should.have.property('run')
    project.actions.at.testcases.should.have.property('random')
    project.actions.at.testcases.run.should.have.property('api')
  })
})
