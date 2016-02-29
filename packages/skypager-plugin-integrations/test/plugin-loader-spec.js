const skypager = require('skypager-project')

skypager.loadPlugin(require.resolve('../index'))

describe( 'The Integrations Plugin Loader', () => {
  it( 'Registers the integrations plugin with the skypager registry', () => {
    skypager.plugins.available.should.containEql('integrations')
    require('../skypager.js').plugins.lookup('integrations').should.be.an.Object()
  })
})
