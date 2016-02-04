import { Application } from 'skypager-application'

import MainLayout from 'layouts/MainLayout'
import HomePage from 'entries/HomePage'
import UploadDocument from 'entries/UploadDocument'


import project from 'dist/bundle'

Application.create({
  root: 'app',
  layout: MainLayout,
  project,
  bundle: project,
  entryPoints:{
    index: {
      component: HomePage
    },
    upload: {
      component: UploadDocument
    }
  }
})
