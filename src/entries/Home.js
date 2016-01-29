import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

export function mapStateToProps (state) {
  return {
    projects: state.projects
  }
}

export class HomeEntry extends React.Component {
  static displayName = 'HomeEntry';

  render () {
    return (
      <div>
        <h1>Home</h1>
        <Link to="projects">Projects</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps)(HomeEntry)
