import React, { PropTypes as types } from 'react'

import { Panel } from 'react-bootstrap'

export class ProjectCard extends React.Component {
  static displayName = 'ProjectCard';

  static propTypes = {
    item: types.object
  };

  render () {
    let { item } = this.props

    return (
      <Panel>
        <h3>{item.title}</h3>
        <p>{item.mainCopy}</p>
      </Panel>
    )
  }
}

export default ProjectCard
