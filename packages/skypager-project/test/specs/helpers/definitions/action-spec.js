import { spy } from 'sinon'

describe.only('Running an action', () => {
  
  let project = require('../../../fixture')
  let action = project.actions.lookup('testcases/emit')

  function genTests() {

    ['error', 'warn', 'suggest', 'info', 'done'].forEach(event => {

      it('should send an event for ' + event, () => {

        let s = new spy()
        let numErrors = event === 'error' ? 1 : 0

        action.on(event, s)
        let result = action.run(event)

        s.should.have.been.called
        result.errors.length.should.equal(numErrors)
      })
    })
  }

  genTests()
})
