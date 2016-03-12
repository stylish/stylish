import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

export class Home extends Component {
  static displayName = 'Home';

  static propTypes = {};

  render() {
    return (
      <div>home</div>
    )
  }
}

export default stateful(Home, 'settings')