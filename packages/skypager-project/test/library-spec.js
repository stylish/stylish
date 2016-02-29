import Skypager from './index'

describe("Skypager", function(){
	it("exposes a public class interface", function(){
		Skypager.should.have.property('Project')
	})

  it( "loads a project", function(){
    Skypager.fixture.should.have.property('content')
  })

  it( "has an asset manifest", function(){
    let man = Skypager.fixture.exporters.run('assets', {project: Skypager.fixture})

    man.should.have.property('documents')
    man.documents.should.have.property('docs/index.md')
    man.documents['docs/index.md'].should.have.property('id')
    man.documents['docs/index.md'].should.have.property('uri')
    man.documents['docs/index.md'].should.have.property('fingerprint')
    man.documents['docs/index.md'].fingerprint.length.should.not.equal(0)
  })
})
