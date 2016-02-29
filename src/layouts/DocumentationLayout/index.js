import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class DocumentationLayout extends Component {
  static displayName = 'DocumentationLayout';

  static propTypes = {
    settings: type.shape({
      branding: type.shape
    }),
    content: type.shape({
      data: type.object
    })
  };

  render() {
    return (
      <div className='layout documentation-layout'>
        { this.props.children }
      </div>
    )
  }
}

export default stateful(DocumentationLayout, 'settings', 'content')
