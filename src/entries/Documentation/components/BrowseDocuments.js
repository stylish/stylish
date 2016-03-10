import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class BrowseDocuments extends Component {
  static displayName = 'BrowseDocuments';

  static propTypes = {};

  render() {
    return (
      <div>
        <h3>Documentation</h3>
      </div>
    )
  }
}

export default stateful(BrowseDocuments, 'settings')
