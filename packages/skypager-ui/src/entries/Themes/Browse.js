import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import { Link } from 'react-router'

const categoryFolder = 'themes'

export class BrowseThemes extends Component {
  static displayName = 'BrowseThemes';

  static propTypes = {
    filters: type.shape({
      categoryFolder: type.string
    })
  };

  static defaultProps = {
    filters: { }
  };

  get themes() {
    let { project } = this.context
    let { filters, copy } = this.props

    return project.scripts.query({ ...filters, categoryFolder })
  }

  render() {
    const copy = this.props.copy

    return (
      <div>Browse Themes</div>
    )
  }
}

export default stateful(BrowseThemes, 'settings', 'themes.filters', 'copy')
