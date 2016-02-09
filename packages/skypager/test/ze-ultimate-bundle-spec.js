describe('The Skypager Project Bundle', function (){
  let project = require('./fixture')
  let exported = require('./fixture/dist/bundle')

  it('contains a single JSON package for the entire project', function(){
    keys(exported).should.containEql('assets','content','project','settings','models')
    keys(exported.content).should.containEql('docs','data_sources','scripts','stylesheets',
                                             'packages','projects','images','vectors','settings')
  })
})
