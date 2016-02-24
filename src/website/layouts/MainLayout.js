import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'ui/applications'

export class MainLayout extends Component {
  static displayName = 'MainLayout';

  render () {
    return (
      <div className='container'>
        {this.props.children}
      </div>
    )
  }
}

export default stateful(MainLayout, 'settings')
