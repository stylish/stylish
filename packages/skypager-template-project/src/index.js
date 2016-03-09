import Project from 'ui/applications/project'

Project.launchApplication().then(app => {
  global.$app = app
  console.log(
    `Welcome to Skypager. Launching app: ${ app.name }`,
    $app
  )
})
