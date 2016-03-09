describe('Plugin Actions', function(){
  it('has a settings/generation action', function(){
    let project = require('./index').project
    project.actions.available.should.containEql('settings/generate')
  })

  it('has a generate:settings action', function(){
    let project = require('./index').project
    project.actions.available.should.containEql('settings/generate')
  })

  it('reads github integration settings from YML in the project', function(){
    let project = require('./index').project
    project.get('settings.integrations').should.have.property('github')
    project.get('settings.integrations.github').should.have.property('applicationId', 'test-github-application-id')
  })

  it('does not leak secrets when exported', function(){
    let project = require('./index').project
    let exp = project.run.exporter('settings')
    let integrations = exp.integrations
    integrations.should.have.property('github')
    integrations.github.should.have.property('applicationSecret')
    integrations.github.applicationSecret.should.be.empty()
  })
})
