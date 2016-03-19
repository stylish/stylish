import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

/**
 * A Detiails Page to display info about a single record e.g. /products/123
 */
export class Detail extends Component {
  static displayName = 'Detail';

  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    return <div />
  }
}

export default stateful(Detail, 'settings', 'copy', 'entities')
