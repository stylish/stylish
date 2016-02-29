describe( 'The Portfolio Plugin Loader', () => {
  it( 'Registers the portfolio plugin with the skypager registry', () => {
    const { skypager } = require('./index')

    skypager.plugins.available.should.containEql('portfolio')
  })

  it( 'makes the plugin available on the project', () => {
    const { project } = require('./index')
    project.plugins.lookup('portfolio').should.be.an.Object()
    project.enabledPlugins.should.containEql('portfolio')
  })

})
