describe( 'The Integrations Plugin Loader', () => {
  it( 'Registers the integrations plugin with the skypager registry', () => {
    const { skypager } = require('./index')
    skypager.plugins.available.should.containEql('integrations')
  })

  it( 'makes the plugin available on the project', () => {
    const { project } = require('./index')
    project.plugins.lookup('integrations').should.be.an.Object()
    project.enabledPlugins.should.containEql('integrations')
  })

})
