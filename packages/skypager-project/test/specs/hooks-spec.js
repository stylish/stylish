describe("Project Lifecycle Hooks", function(){
  let project = require('../fixture')

  it("runs the lifecycle hooks passed in via the loader", function(){
    project.registryHookRan.should.equal(true)
  })
})
