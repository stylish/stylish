import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

export class BrowseLayouts extends Component {
  static displayName = 'BrowseLayouts';

  static propTypes = {};

  render() {
    return (
      <div>BrowseLayouts</div>
    )
  }
}

export default stateful(BrowseLayouts, 'settings')
