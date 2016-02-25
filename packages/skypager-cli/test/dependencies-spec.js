describe('dependency checks', function(){
  let deps = require('../src/dependencies').packages

  it ('should tell me info about the packages', function(){
    deps.should.have.property('skypager-themes')
    deps.should.have.property('skypager-server')
    deps.should.have.property('skypager-project')
    deps.should.have.property('skypager-electron')
    deps.should.have.property('skypager-devpack')
    deps.should.have.property('skypager-cli')
    deps.should.have.property('skypager')
  })
})
