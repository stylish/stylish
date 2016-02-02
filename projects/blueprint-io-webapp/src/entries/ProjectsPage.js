import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'skypager-application'

export class ProjectsPage extends Component {
  render () {
    return (
      <div>
        <h1>Projects Page</h1>
      </div>
    )
  }
}

export default stateful(ProjectsPage, 'projects')
