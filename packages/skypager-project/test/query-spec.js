describe( 'Project Query Interface', function(){
  const project = require('./fixture')

  it ('Lets you query registries to find helpers', function(){
    let results = project.models.query(action => action.id === 'log')
    results.length.should.equal(1)
  })

  it ('Lets you query collections to find documents', function(){
    project.docs.query({id:/structure-spec$/}).length.should.equal(1)
  })

  it ('lets you query entities', function(){
    project.query('testcases', {id:/structure/}).length.should.equal(1)
  })

})

