describe('dependency checks', function(){
  let deps = require('../src/dependencies')

  it ('should tell me info about the packages', function(){
    deps.checkAll()

    $skypager.should.have.property('skypager-themes')
    $skypager.should.have.property('skypager-server')
    $skypager.should.have.property('skypager-project')
    $skypager.should.have.property('skypager-electron')
    $skypager.should.have.property('skypager-devpack')
  })
})
