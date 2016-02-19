import { Application } from 'ui/applications'

import HomePage from './entries/HomePage'
import MainLayout from './layouts/MainLayout'

function loadApp(project, hot = false) {
  Application.create({
    project,
    layout: MainLayout,
    hot,
    entryPoints:{
      index: HomePage
    }
  })
}

loadApp(
  require('dist/bundle')
)

if (module.hot) {
  module.hot.accept('dist/bundle', () => {
    loadApp(
      require('dist/bundle'),
      true
    )
  })
}
