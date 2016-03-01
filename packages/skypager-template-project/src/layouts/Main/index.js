import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'ui/applications'

export class Main extends Component {
  static displayName = 'Main';

  render () {
    return (
      <div className='container'>
        {this.props.children}
      </div>
    )
  }
}

export default stateful(Main, 'settings')
