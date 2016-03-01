import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class DocumentationLayout extends Component {
  static displayName = 'DocumentationLayout';

  static propTypes = {};

  render() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

export default stateful(DocumentationLayout, 'settings')
