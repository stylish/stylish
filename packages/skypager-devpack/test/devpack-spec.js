describe('Skypager Devpack', function () {
  context('build profiles', function () {
    const devpack = require('../src').argsFor
    const project = require('../skypager.js')

    it('generates options for a production website build', function () {
      let args = devpack('build', 'react_webapp', 'production', project)

      args.should.have.property('contentHash', true)
      args.should.have.property('platform', 'web')
      args.should.have.property('env', 'production')
      args.should.have.property('publicPath', '/')
    })

    it('generates options for a production electron build', function () {
      let args = devpack('build', 'react_electron', 'production', project)

      args.should.have.property('noContentHash', true)
      args.should.have.property('platform', 'electron')
      args.should.have.property('env', 'production')
      args.should.have.property('publicPath', '')
    })

    it('generates options for a development website build', function () {
      let args = devpack('build', 'react_webapp', 'development', project)

      args.should.have.property('noContentHash', true)
      args.should.have.property('platform', 'web')
      args.should.have.property('env', 'development')
      args.should.have.property('publicPath', '/')
    })

    it('generates options for a development electron build', function () {
      let args = devpack('serve', 'react_electron', 'development', project)

      args.should.have.property('noContentHash', true)
      args.should.have.property('platform', 'electron')
      args.should.have.property('env', 'development')
      args.should.have.property('publicPath', '/')
    })

  })
})
