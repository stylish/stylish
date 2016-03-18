import isEmpty from 'lodash/isEmpty'

describe('Collection Scopes', function() {
  const project = require('../fixture')
  let documents = project.docs
  documents.scope('withData', (doc) => doc.data && !isEmpty(doc.data))

  it('supports defining a named query on the collection', function() {
    documents.should.have.property('withData')
  })

  it('runs the query and returns the expected results', function() {
    let results = documents.withData
    results.should.not.be.empty
    results.should.be.an('array')
  })
})
