import rimraf from 'rimraf'
import { existsSync as exists } from 'fs'
import { join } from 'path'
import { handle } from 'skypager/src/commands/init'

describe('project init command', function() {
  let project = require('./fixture')
  let tmp = project.path('tmpdir', 'new-project')

  before(function(){
    handle('new-project', tmp, { overwrite: true })
  })

  after(function(){
    rimraf.sync(tmp)
  })

  it('creates project scaffolding', function() {
    let folders = ['docs','settings','data','actions','models', 'src']
    folders.filter(f => exists(join(tmp, f))).should.have.property('length', folders.length)
  })
})
