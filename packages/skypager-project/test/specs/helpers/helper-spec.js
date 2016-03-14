import { spy } from 'sinon'

describe('Monitoring events on a helper', () => {

  let project = require('../../fixture')
  let helper = project.actions.all[0]
  let s = new spy()
  let token = helper.on('test', s)

  it('should allow subscription to an event', () => {
    token.should.not.be.null
  })

  it('should execute the callback when the event occurs', () => {
    helper.emit('test', 'test arg')
    s.should.have.been.calledWith('test arg')
  })

})
