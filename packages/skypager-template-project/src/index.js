import { Application } from 'ui/applications'
import ProjectLoader from 'project/loader'

const project = ProjectLoader(
  require('dist/bundle')
)

Application.create({
  project
})
