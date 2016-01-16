describe("Content Collections", ()=>{
  const project = require('./fixture') 
  const content = project.content
  const documents = project.content.documents
  const collections = Object.keys(content).map(key => content[key])
  
  it("provides simple access via asset id", ()=>{
    documents.at('index').should.be.an.Object
  })

  it("returns all of the assets as an array", ()=>{
    documents.all.length.should.not.equal(0)
  })

  it("has all of the collections for different asset classes", ()=>{
    Object.keys(content).should.containEql('assets')
    Object.keys(content).should.containEql('data_sources')
    Object.keys(content).should.containEql('documents')
    Object.keys(content).should.containEql('images')
    Object.keys(content).should.containEql('scripts')
    Object.keys(content).should.containEql('stylesheets')
    Object.keys(content).should.containEql('vectors')
  })

  it("knows the extension and glob pattern for different asset classes", ()=>{
    Object.values(content).forEach(collection => {
      collection.AssetClass.should.be.a.Function()
      collection.AssetClass.EXTENSIONS.should.be.a.Array()
    })
  })

  it("can be searched by glob", ()=>{
    documents.glob('**/data-source-spec*').length.should.equal(1)
    documents.glob('**/data-sources-spec*').length.should.equal(0)
  })

  it("gives patterns to be used to match related assets", ()=>{
    content.data_sources.relatedGlob(documents.at('assets/data-source-spec')).length.should.equal(2)
  })
})
