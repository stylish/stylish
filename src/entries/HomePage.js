import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class HomePage extends Component {
  static displayName = 'HomePage';

  static propTypes = {};

  render() {
    return (
      <div ><h1>welcome home</h1></div>
    )
  }
}

export default stateful(HomePage, 'settings')
