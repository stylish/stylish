import set from 'lodash/set'
import isArray from 'lodash/isArray'

describe("Content Collections", function(){
  const project = require('../fixture')
  const content = project.content
  const documents = project.content.documents
  const collections = Object.keys(content).map(key => content[key])

  it("provides simple access via asset id", function() {
    documents.at('index').should.be.an('object')
    documents.at('index').should.have.property('paths')
  })

  it("returns all of the assets as an array", function(){
    documents.all.should.be.an('array')
    documents.all.should.not.be.empty
  })

  it("has all of the collections for different asset classes", function(){
    content.should.have.any.keys('assets','copy_files','documents','data_sources',
                                 'scripts','vectors','images','testcases','stylesheets')
  })

  it("knows the extension and glob pattern for different asset classes", function(){
    Object.values(content).forEach(collection => {
      collection.AssetClass.should.be.a('function')
      collection.AssetClass.EXTENSIONS.should.be.an('array')
    })
  })

  it("can be searched by glob", function(){
    documents.glob('**/data-source-spec*').should.not.be.empty
    documents.glob('**/data-sources-spec*').should.be.empty
  })

  it("exposes patterns to be used to match related assets", function(){
    content.data_sources.relatedGlob(
      documents.at('assets/data-source-spec')
    ).length.should.equal(2)
  })

  it('provides an enumerable like interface', function(){
    content.data_sources.map(a => a).should.not.be.empty
    content.data_sources.filter(a => false).should.be.empty
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
  })

  describe('Asset Class Collection Deocrator', function() {
    it('decorates the collection with an interface specific to the asset class', function() {
      documents.should.have.property('groups')
      documents.should.have.property('categories')
      documents.should.have.property('types')

      documents.categories.should.contain('testcases')
      documents.types.should.contain('testcase')
    })
  })
})
