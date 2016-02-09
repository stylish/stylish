const skypager = require('skypager')

skypager.loadPlugin(require.resolve('../src/index'))

describe( 'The Blueprint Plugin Loader', () => {
  it( 'Registers the blueprints plugin with the skypager registry', () => {
    skypager.plugins.available.should.containEql('blueprints')
    require('../skypager.js').plugins.lookup('blueprints').should.be.an.Object()
  })
})
