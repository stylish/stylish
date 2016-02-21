describe('The Settings System', function(){
  const project = require('./fixture')

  it('merges all of the settings yml files into a single structure', function(){
    project.settings.should.have.property('app')
    project.settings.should.have.property('integrations')
  })

  it('merges a folder into a single structure keyed by the filename', function(){
    project.settings.should.have.property('servers')
    project.settings.servers.should.have.property('local')
    project.settings.servers.should.have.property('dev')
  })

  it('automatically detects environment branches in the settings', function(){
     project.settings.servers.dev.should.have.property('env', 'test')
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

  it('should not let me expose environment variables that arent whitelisted', function(){
     project.settings.security.environment.ok.should.equal(process.env.PWD)
     project.settings.security.environment.should.have.property('unsafe', '')
     project.settings.security.environment.should.have.property('safe')
     project.settings.security.environment.nobueno.should.equal(' is cool')
  })
})
