describe( "The Entity System", function(){
  it( "stores entities on the project", function(){
    let project = require('./fixture')
    project.entities.should.have.property('testcases')
    project.entities.testcases.should.have.property('testcases/structure-spec')
  })

  it( "Runs the entity through the model creator function", function(){
    let project = require('./fixture')
    let entity = project.entities.testcases['testcases/structure-spec']
    entity.should.have.property('id')
    entity.should.have.property('specifications')
  })
})
