import { join, normalize } from 'path' 
import { removeAsync, existsSync, ensureDirSync, copyAsync, readFileAsync } from 'fs-extra-promise'
import { Promise } from 'bluebird'

describe('Settings Generation', function() {

  const srcFolder = normalize(join(__dirname, '../../../../src/settings'))
  const fixtureFolder = normalize(join(__dirname, '../../../fixture/settings'))
  const srcIntegrationsFolder = join(srcFolder, 'integrations')
  const srcDataSourcesFolder = join(srcFolder, 'data_sources')
  const fixtureIntegrationsFolder = join(fixtureFolder, 'integrations')
  const fixtureDataSourcesFolder = join(fixtureFolder, 'data_sources')

  let files = {
    'test1.yml': [ 
      { source: srcIntegrationsFolder, dest: 'integrations' } ,
      { source: srcDataSourcesFolder, dest: 'data_sources' }
    ],
    'test2.yml': [ 
      { source: srcIntegrationsFolder, dest: 'integrations' } ,
      { source: srcDataSourcesFolder, dest: 'data_sources' }
    ],
    'test3.yml': [ 
      { source: srcIntegrationsFolder, dest: 'integrations' } 
    ],
    'test4.yml': [
      { source: fixtureIntegrationsFolder, dest: 'integrations' },
      { source: fixtureDataSourcesFolder, dest: 'data_sources' }
    ]
  }

  const actionName = 'settings/generate'
  let project
  let action
  
  before(function(done) {

    this.timeout = 5000
    ensureDirSync(fixtureIntegrationsFolder)
    ensureDirSync(fixtureDataSourcesFolder)

    Promise.map(Object.getOwnPropertyNames(files), filename => {
      let instructions = files[filename]
      return Promise.map(instructions, i => {
        return copyAsync(join(__dirname, filename), join(i.source, filename))
      })
    }).then(() => {
      project = require('../../../index').project
      action = project.actions.lookup(actionName)
    }).then(() => { 
      done() 
    }).catch(e => {
      console.log('error copying file: ' + e)
      throw e
    })
  })

  after(function(done) {
    Promise.map(Object.getOwnPropertyNames(files), filename => {
      let instructions = files[filename]
      return Promise.map(instructions, i => {
        return removeAsync(join(fixtureFolder, i.dest, filename)).then(() => {
         return removeAsync(join(srcFolder, i.dest, filename))
        })
      }).then(() => {
        return Promise.all([
          removeAsync(join(fixtureFolder, 'integrations', 'int_test4.yml')),
          removeAsync(join(fixtureFolder, 'data_sources', 'ds_test4.yml'))
        ])
      })
    }).then(() => { 
      done() 
    }).catch(e => {
      console.log('error removing file: ' + e)
      throw e
    })
  })

  afterEach(function() {
    if (action) {
      action.clearSubscriptions()
    }
  })

  it('project should have a settings generation action', () => {
    project.actions.available.should.contain(actionName)
  })

  function ensureSettingsfileCopied(file) {
    return readFileAsync(join(fixtureFolder, file)).then(file => {
      return file.length.should.be.above(0)
    })
  }

  it('settings should be scaffolded for a single available service', done => {

    let files = [
      'integrations/test1.yml',
      'data_sources/test1.yml'
    ]

    action.on('done', () => {
      return Promise.map(files, file => {
        return ensureSettingsfileCopied(file)
      }).then(() => { done() })
    })

    let result = project.actions.run(actionName, 'test1')
    result.errors.length.should.equal(0)
  })

  it('settings should be scaffolded for multiple available services', done => {

    let files = [ 
      'integrations/test2.yml', 
      'integrations/test3.yml',
      'data_sources/test2.yml',
    ]

    action.on('done', () => {
      return Promise.map(files, file => {
        return ensureSettingsfileCopied(file)
      }).then(() => { done() })
    })

    let result = project.actions.run(actionName, ['test2', 'test3'])
    result.errors.length.should.equal(0)
  })

  it('an error should be returned if an integration for a requested service is not available', done => {

    action.on('error', e => {
      done()
    })

    project.actions.run(actionName, 'doesntexist')
  })

  it('a warning should occur if settings for a requested service already exist', done => {

    action.on('warn', msg => {
      if (msg.startsWith('integration')) {
        done()
      }
    })

    let result = project.actions.run(actionName, 'test4')
    result.errors.length.should.equal(0)
  })

})
