import { Application } from 'ui/applications'
import DefaultLayout from 'ui/layouts/DefaultLayout'
import HomePage from './entries/HomePage'

Application.create({
  root: 'app',
  layout: DefaultLayout,
  entryPoints:{
    index: {
      component: HomePage
    }
  }
})
