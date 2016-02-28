import { Application } from 'ui/applications'

import project from 'dist/bundle'
import MainLayout from './layouts/MainLayout'
import HomePage from './entries/HomePage'

Application.create({
  project,
  layout: MainLayout,
  entryPoints: {
    index: HomePage
  }
})
