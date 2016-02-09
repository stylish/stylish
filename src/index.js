import { Application } from 'skypager-application'

import MainLayout from 'layouts/MainLayout'
import HomePage from 'entries/HomePage'
import Button from 'react-bootstrap/lib/Button'
import project from 'dist/bundle'

Application.create({
  root: 'app',
  layout: MainLayout,
  project,
  bundle: project,
  entryPoints:{
    index: {
      component: HomePage
    }
  }
})
