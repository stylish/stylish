describe('The Project Vault', function() {
  let project = require('../fixture')

  it('can be accessed on the project', function(){
    project.should.have.property('vault')
  })

  it('white lists which environment variables can be used in templates', function(){
    project.vault.should.have.property('templates')
    project.vault.templates.should.have.property('accessibleEnvVars')
  })

  xit('prevents protected files from being exported', function(){

  })
})
