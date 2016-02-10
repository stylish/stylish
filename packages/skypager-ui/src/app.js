import { Application } from './application'

import FluidLayout from './layouts/FluidLayout'

import BrowseLayouts from './entries/BrowseLayouts'
import BrowseComponents from './entries/BrowseComponents'
import BrowseThemes from './entries/BrowseThemes'
import HomePage from './entries/HomePage'
import ViewComponent from './entries/ViewComponent'
import ViewLayout from './entries/ViewLayout'
import ViewTheme from './entries/ViewTheme'

Application.create({
  root: 'app',
  layout: FluidLayout,
  entryPoints:{
    index: HomePage,
    themes: BrowseThemes,
    '/themes/:id': ViewTheme,
    components: BrowseComponents,
    '/components/:id': ViewComponent,
    layouts: BrowseLayouts,
    '/layouts/:id': ViewLayout
  }
})
