import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

export class BrowseThemes extends Component {
  static displayName = 'BrowseThemes';

  static propTypes = {};

  render() {
    return (
      <div>BrowseThemes</div>
    )
  }
}

export default stateful(BrowseThemes, 'settings')
