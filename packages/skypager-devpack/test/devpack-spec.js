describe('Skypager Devpack', function () {
  context('build profiles', function () {
    const devpack = require('../src').devpack
    const project = require('../skypager.js')

    it('generates options for a production website build', function () {
      let args = devpack('build', 'react_webapp', 'production', project, {test: true})

      args.should.have.property('platform', 'web')
      args.should.have.property('publicPath', '/')
    })

    it('generates options for a production electron build', function () {
      let args = devpack('build', 'react_electron', 'production', project, {test:true})

      args.should.have.property('platform', 'electron')
      args.should.have.property('publicPath', '')
    })

    it('generates options for a development website build', function () {
      let args = devpack('serve', 'react_webapp', 'development', project, {test:true})
      args.should.have.property('env', 'development')
      args.should.have.property('publicPath', '/')
    })

    it('generates options for a development electron build', function () {
      let args = devpack('serve', 'react_electron', 'development', project, {test: true})

      args.should.have.property('platform', 'electron')
      args.should.have.property('publicPath', '/')
    })

  })
})
