describe('The Settings System', function(){
  const project = require('./fixture')

  it('merges all of the settings yml files into a single structure', function(){
    project.settings.should.have.property('app')
    project.settings.should.have.property('integrations')
  })

  it('interpolates values using the lodash template syntax', function(){
    project.settings.app.env.should.equal('test')
  })

  it('has a convenience method for including environment variables', function(){
    project.settings.integrations.github.token.should.equal('test')
  })

  it('has a dedicated settings path', function(){
    project.paths.should.have.property('settings')
    project.paths.settings.should.match(/test.fixture.settings/)
    project.content.settings_files.should.have.property('root')
  })
})
