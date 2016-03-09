import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class Documentation extends Component {
  static displayName = 'Documentation';

  static propTypes = {
    copy: type.object,
    content: type.object,
    settings: type.shape({
      icon: type.string,
      brand: type.string
    })
  };

  render() {
    return (
      <div>{ this.props.children }</div>
    )
  }
}

export default stateful(Documentation, 'settings', 'content', 'copy')
