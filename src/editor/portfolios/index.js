import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class MyComponent extends Component {
  static displayName = 'MyComponent';

  static propTypes = {};

  render() {
    return (
      <div />
    )
  }
}

export default stateful(MyComponent, 'settings')
