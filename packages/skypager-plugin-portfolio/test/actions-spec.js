describe('Plugin Actions', function(){
  let project = require('./index').project

  it('has a settings/generation action', function(){
    project.actions.available.should.containEql('settings/generate')
  })

  it('has a packages/each action', function(){
    project.actions.available.should.containEql('packages/each')
  })

})
