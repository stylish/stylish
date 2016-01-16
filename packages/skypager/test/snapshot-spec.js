import { existsSync as exists, writeFileSync as writeFile, readFileSync as readFile, mkdirSync as mkdir } from 'fs'

describe( "The Snapshot Exporter", () => {
  const project = require('./fixture')
  const path = project.path('build', 'snapshot.json')

  var snapshot, parsed

  before(() => {
    snapshot = snapshot || project.run.exporter('snapshot')
    project.run.exporter('disk', {type: 'snapshot'})
    parsed = parsed || JSON.parse(readFile(path).toString())
  })

  it( "saves the snapshot to disk", () => {
    exists(path).should.equal(true)
  })

  it( "includes the entities in the JSON", () => {
    parsed.should.have.property('entities')
    parsed.entities.should.have.property('testcases')
    parsed.entities.testcases.should.not.be.empty()
    parsed.entities.testcases['testcases/structure-spec'].should.have.property('example','metadata')
  })

  it( "includes the asset manifest in the JSON", () => {
    parsed.assets.should.have.property('documents')
    parsed.assets.documents.should.have.property('docs/testcases/structure-spec.md')
    let doc = parsed.assets.documents['docs/testcases/structure-spec.md']
    doc.should.have.property('fingerprint')
  })

  it( "includes the collection bundle in the JSON", () => {
    parsed.should.have.property('content')
  })
})
