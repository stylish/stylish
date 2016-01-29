describe("Skypager.Document", ()=>{
  let project = require('./fixture')
  let document = project.docs && project.docs.at('index')

  it("provides access to the markdown AST", ()=>{
    document.should.have.property('parsed')
    document.parsed.children.should.not.be.empty()
  })

  it("indexes the mdast nodes", ()=>{
    document.should.have.property('indexed')
    document.indexed.children.should.not.be.empty()
  })

  it("provides access to mdast nodes by id", ()=>{
    document.nodes.at('specifications').should.have.property('id','specifications')
    document.nodes.at.id('specifications').should.have.property('id','specifications')
  })

  describe("Node Query Interface", ()=>{
    it("gives me the descendants of heading nodes", ()=>{
      document.nodes.at.id('specifications').should.have.property('descendants')
      document.nodes.at.id('specifications').descendants.should.not.be.empty()
    })

    it("provides access to the markdown content of a specific section", ()=>{
      document.nodes.at.id('setup').should.have.property('lines')
      document.nodes.at.id('setup').lines.should.have.property('raw')
      document.nodes.at.id('setup').lines.should.have.property('start')
    })

    it("provides a means of querying the documents structure",()=>{
      document.nodes.of.type('code').should.not.be.empty()
      document.nodes.of.type('heading').should.not.be.empty()
    })

    it("provides access to code blocks", ()=>{
      document.code.all.should.not.be.empty()
      document.code.all.pluck('type').unique().should.containEql('code')
      document.code.javascript.should.not.be.empty()
    })

    it("provides access to section heading text", ()=>{
      document.headings.sections.text.should.containEql('Specifications','Setup')
    })

    it("provides access to siblings", ()=>{
      let heading = document.nodes.at('specifications')
      heading.should.have.property('siblings')
      heading.siblings.should.have.property('next')
      heading.siblings.should.have.property('previous')
      heading.siblings.previous.should.have.property('id','setup')
      heading.siblings.previous.siblings.next.should.have.property('id','specifications')
    })

    it("provides a query interface for its descendants", ()=>{
      let heading = document.nodes.at('specifications')
      heading.query({type:'none'}).should.have.property('length', 0)
      heading.query({type:'heading'}).pluck('type').should.not.containEql('code')
      heading.query({type:'heading',depth:3}).should.have.property('length', 4)
    })

    it("renders and wraps it appropriately HTML", () => {
      document.html.content.should.containEql('main id="index" class="skypager-document')
    })

    it("wraps the rendered html in a css selctor engine", () => {
      document.$('main section').length.should.equal(2)
      document.selector('main section article').length.should.equal(4)
    })

    it("provides access to the main section paragraph copy", () => {
      document.mainCopy.length.should.equal(281)
    })

    it("provides access to a specific sections html", () => {
      document.selector('section#specifications').html().length.should.not.equal(0)
    })

    it("can generate new documents from the model generator", () => {
      let content = project.models.lookup('page').generate({attrs:{title:'hi'}, data:{type:'skypager'}})
      content.should.equal('---\ntype: skypager\n---\n\n# hi')
    })

    it("can generate new documents with arbitrary content", () => {
      let content = project.models.lookup('page').generate({data:{type:'skypager'}, content: '# sup baby'})
      content.should.containEql('---\ntype: skypager\n---\n\n# sup baby')
    })
  })
})
