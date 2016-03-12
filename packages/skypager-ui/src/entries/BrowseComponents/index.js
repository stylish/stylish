import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

export class BrowseComponents extends Component {
  static displayName = 'BrowseComponents';

  static propTypes = {};

  render() {
    return (
      <div>BrowseComponents</div>
    )
  }
}

export default stateful(BrowseComponents, 'settings')
