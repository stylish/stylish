import React from 'react'
import CardsContainer from 'components/CardsContainer'
import ProjectCard from 'entries/components/ProjectCard'
import IconNavLayout from 'skypager-ui/src/layouts/IconNavLayout'

import { connect } from 'react-redux'

export function mapStateToProps (state) {
  return {
    projects: state.projects
  }
}

export class ProjectsEntry extends React.Component {
  static displayName = 'ProjectsEntry';

  render () {
    const projects = Object.keys(this.props.projects).map(k => this.props.projects[k])

    const links = [{
      icon: 'home',
      label: 'Home',
      link: '/'
    }]

    return (
      <IconNavLayout wide brandIcon='rocket' links={links}>
        <CardsContainer perRow={3}
                        items={projects}
                        card={ProjectCard} />
      </IconNavLayout>
    )
  }
}

export default connect(mapStateToProps)(ProjectsEntry)
