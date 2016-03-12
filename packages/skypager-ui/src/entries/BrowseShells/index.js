import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

export class BrowseShells extends Component {
  static displayName = 'BrowseShells';

  static propTypes = {};

  render() {
    return (
      <div>BrowseShells</div>
    )
  }
}

export default stateful(BrowseShells, 'settings')
