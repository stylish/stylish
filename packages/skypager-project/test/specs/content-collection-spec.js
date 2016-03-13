import set from 'lodash/set'

describe("Content Collections", function(){
  const project = require('../fixture')
  const content = project.content
  const documents = project.content.documents
  const collections = Object.keys(content).map(key => content[key])

  it("provides simple access via asset id", function() {
    documents.at('index').should.be.an('object')
  })

  it("returns all of the assets as an array", function(){
    documents.all.length.should.not.equal(0)
  })

  it("has all of the collections for different asset classes", function(){
    Object.keys(content).should.contain('assets')
    Object.keys(content).should.contain('data_sources')
    Object.keys(content).should.contain('documents')
    Object.keys(content).should.contain('images')
    Object.keys(content).should.contain('scripts')
    Object.keys(content).should.contain('stylesheets')
    Object.keys(content).should.contain('vectors')
  })

  it("knows the extension and glob pattern for different asset classes", function(){
    Object.values(content).forEach(collection => {
      collection.AssetClass.should.be.a('function')
      collection.AssetClass.EXTENSIONS.should.be.an('array')
    })
  })

  it("can be searched by glob", function(){
    documents.glob('**/data-source-spec*').length.should.equal(1)
    documents.glob('**/data-sources-spec*').length.should.equal(0)
  })

  it("exposes patterns to be used to match related assets", function(){
    content.data_sources.relatedGlob(documents.at('assets/data-source-spec')).length.should.equal(2)
  })

  it('provides an enumerable like interface', function(){
    content.data_sources.map(a => a).length.should.not.equal(0)
    content.data_sources.filter(a => false).length.should.equal(0)
    content.data_sources.filter((a,i) => i === 0).length.should.equal(1)
  })

  it('can merge map, filter, or query results into a single object', function(){
    let merged = content.data_sources.query({id:/merge/}).merge()
    merged.alpha.should.have.property('my_dog', 'sup')
    merged.bravo.should.have.property('cool', 'feature')
  })

  it('can condense map, filter, or query results into a single object', function(){
    let condensed = content.data_sources.query({id:/merge/}).condense()
    condensed.should.have.property('merge/alpha')
    condensed.should.have.property('merge/bravo')
  })

  describe('Custom Collections', function() {
    it('can pull collection config from settings data', function(){
      let testpath = project.path('documents')
      project.settings.collections.should.have.property('testcases')
      project.settings.collections.testcases.should.have.property('root', testpath)
    })

    it('adds collections based on custom ones found in the settings data', function(){
    })
  })
})
