import React, { Component, PropTypes as types } from 'react'
import { util } from 'ui/applications'

export class ProjectsPage extends Component {
  render () {
    return (
      <div>
        <h1>Projects Page</h1>
      </div>
    )
  }
}

export default util.stateful(ProjectsPage, 'projects')
