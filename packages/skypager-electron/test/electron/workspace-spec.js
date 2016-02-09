import Application from '../../src/application'
import Workspace from '../../src/workspace/workspace'

describe("Workspaces", () => {
  it("should have panels", () => {
      let project = require('../../skypager.js')
      let app = new Application(project, {  })
      let workspace = app.createWorkspace('main')

      workspace.panelNames.should.containEql('console','presentation')

      console.log(workspace.launchPanels())
    })
})
