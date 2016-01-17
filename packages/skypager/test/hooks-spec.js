describe("Project Lifecycle Hooks", () => {
  let project = require('./fixture')

  it("runs the lifecycle hooks passed in via the loader", () => {
    project.registryHookRan.should.equal(true)
  })
})
