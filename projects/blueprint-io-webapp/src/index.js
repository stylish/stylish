import bundle from 'dist/bundle'

import { LockedApplication as Application, ProjectBundle } from 'skypager-application'

import HomePage from 'entries/HomePage'
import MainLayout from 'layouts/MainLayout'

const { keys, assign } = Object

const project = new ProjectBundle(bundle)

const app = Application.create({
  root: 'app',
  main: MainLayout,
  lock: project.settings.integrations.auth0,
  initialState: {
    get entities() {
      return project.entities
    },
    get entities() {
      return project.content
    },
    get settings () {
      return project.settings
    }
  },
  reducers: {
    settings (state = project.settings, {type, payload}) {
      return state
    },
    content (state = project.content, {type,payload}) {
      return state
    },
    entities (state = project.entities, {type,payload}) {
      return state
    },
  },
  entryPoints: {
    index: HomePage
  }
})

