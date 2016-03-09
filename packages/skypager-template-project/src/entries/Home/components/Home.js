import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class Home extends Component {
  static displayName = 'Home';

  static propTypes = {
    copy: type.object,
    content: type.object,
    settings: type.shape({
      icon: type.string,
      brand: type.string
    })
  };

  render() {
    const { copy } = this.props

    return (
      <div className='container'>
        <h1>Hello, how are you?</h1>
      </div>
    )
  }
}

export default stateful(Home, 'settings', 'copy')
