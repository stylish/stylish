import React, { Component, PropTypes as types } from 'react'

export class MainLayout extends Component {
  static displayName = 'MainLayout';

  render () {
    return (
      <div>
      { this.props.children }
      </div>
    )
  }
}

export default MainLayout
