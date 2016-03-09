import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class ViewDocument extends Component {
  static displayName = 'ViewDocument';

  static propTypes = {};

  render() {
    return (
      <div>Viewing Document</div>
    )
  }
}

export default stateful(ViewDocument, 'settings')
