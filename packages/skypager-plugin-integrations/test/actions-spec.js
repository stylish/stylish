describe('Plugin Actions', function(){
  let project = require('./fixture')

  it('has a generate:settings action', function(){
    project.actions.available.should.containEql('settings/generate')
  })
})
