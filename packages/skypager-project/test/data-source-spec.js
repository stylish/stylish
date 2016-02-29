import Skypager from './index'

describe("DataSources", function(){
  const project = require('./fixture')

  it("can be accessed through the project content collections", function(){
    typeof(project.content.data_sources.at('inspiration')).should.not.equal('undefined')
  })

  it("parses YAML", function(){
    let datasource = project.content.data_sources.at('inspiration')
    datasource.data.should.have.property('note', 'This exists to show how YAML can be used to power an entity.')
  })

  it("parses JSON", function(){
    let datasource = project.content.data_sources.at('example')
    datasource.data.should.have.property('name','Example')
  })

  describe('Script Datasources', function(){
    it("gets run in the scope of the data source asset", function(){
      let datasource = project.content.data_sources.at('scripts/simple-exports')
      datasource.data.id.should.equal('scripts/simple-exports')
    })

    it("gets run with certain values in the global scope", function(){
      let datasource = project.content.data_sources.at('scripts/global-scope-helpers')
      datasource.data.should.containEql('util', 'project', 'datasource')
    })
  })
})
