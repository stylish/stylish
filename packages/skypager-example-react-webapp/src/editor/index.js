import { Application } from 'ui/applications'

import project from 'dist/bundle'

import Preview from './Preview'
import Tools from './Tools'

Application.create({
  project,
  entryPoints:{
    index: { component: Tools },
    tools: { component: Tools },
    preview: { component: Preview }
  }
})
