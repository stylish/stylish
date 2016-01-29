import React from 'react'
import { Route } from 'react-router'
import { WebApplication } from 'skypager-application'

import bundle from 'dist/bundle'

import HomeEntry from 'entries/Home'
import ProjectsEntry from 'entries/Projects'

import * as stores from 'stores'

WebApplication.render({
  defaultEntry: HomeEntry,

  entries: {
    "projects": ProjectsEntry
  },

  state: [
    bundle.entities
  ],

  reducers: [
    stores
  ]
})
