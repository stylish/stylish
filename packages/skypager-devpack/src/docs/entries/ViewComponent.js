import React, { Component, PropTypes as types } from 'react'

export class ViewComponent extends Component {
  static displayName = 'ViewComponent';

  render () {
    return (
      <h1>Browse Components</h1>
    )
  }
}

export default ViewComponent
